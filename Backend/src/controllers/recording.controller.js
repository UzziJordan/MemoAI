const Recording = require('../models/Recordings');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const axios = require('axios');
const { createNotification } = require('./notification.controller');
const { sendTranscriptionReadyEmail } = require('../utils/emailService');

// Multer memory storage for Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else cb(new Error('Only audio files allowed'));
  },
  limits: { fileSize: 25 * 1024 * 1024 }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadMiddleware = upload.single('audio');

// POST /api/recordings/upload
exports.uploadRecording = async (req, res) => {
  try {
    console.log(`[Upload] Received upload request. File: ${req.file?.originalname}, size: ${req.file?.size}`);
    
    if (!req.file) {
      console.error(`[Upload] No file found in request.`);
      return res.status(400).json({ message: 'No audio file uploaded' });
    }

    const { title, duration, tag } = req.body;
    const userId = req.user.id;
    
    console.log(`[Upload] Metadata - Title: ${title}, Duration: ${duration}, Tag: ${tag}, User: ${userId}`);

    console.log(`[Upload] Starting Cloudinary stream upload...`);
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'memoai/recordings',
          public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`
        },
        (error, result) => {
          if (error) {
            console.error(`[Upload] Cloudinary error:`, error);
            reject(error);
          } else {
            console.log(`[Upload] Cloudinary success: ${result.secure_url}`);
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    console.log(`[Upload] Creating database record...`);
    const recording = await Recording.create({
      user: userId,
      title: title || 'Untitled Recording',
      duration: Number(duration) || 0,
      audioUrl: uploadResult.secure_url,
      tag: tag || '',
      status: 'processing'
    });
    console.log(`[Upload] Database record created: ${recording._id}`);

    processRecording(recording._id, uploadResult.secure_url);

    res.status(202).json({
      message: 'Recording uploaded, processing started',
      recording
    });
  } catch (err) {
    console.error('[Upload] Full error stack:', err);
    res.status(500).json({ message: 'Server error during upload', details: err.message });
  }
};

// GET /api/recordings
exports.getRecordings = async (req, res) => {
  try {
    const recordings = await Recording.find({ user: req.user.id })
    .sort({ createdAt: -1 });
    res.status(200).json({ recordings });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/recordings/:id
exports.getRecordingById = async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    res.status(200).json({ recording });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/recordings/:id
exports.updateRecording = async (req, res) => {
  try {
    const { title, tag } = req.body;
    const update = {};
    if (title!== undefined) update.title = title.trim();
    if (tag!== undefined) update.tag = tag.trim();

    const recording = await Recording.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: update },
      { returnDocument: 'after', runValidators: true }
    );

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    res.status(200).json({ recording });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/recordings/:id/todos/:todoId
exports.updateRecordingTodo = async (req, res) => {
  try {
    const { completed } = req.body;

    const recording = await Recording.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    const todo = recording.todoList.id(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (completed!== undefined) todo.completed = completed;
    await recording.save();

    res.status(200).json({ recording });
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/recordings/:id
exports.deleteRecording = async (req, res) => {
  try {
    const recording = await Recording.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    try {
      const urlParts = recording.audioUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex!== -1) {
        const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      }
    } catch (cloudErr) {
      console.error('Cloudinary delete error:', cloudErr);
    }

    res.status(200).json({ message: 'Recording deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/recordings/:id/retry-ai
exports.retryAIProcessing = async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!recording) {
      return res.status(404).json({ message: 'Recording not found' });
    }

    if (!recording.transcript) {
      return res.status(400).json({ message: 'No transcript available to process' });
    }

    // Set to processing and respond immediately
    recording.status = 'processing';
    await recording.save();

    // Run AI part only
    runAiExtraction(recording._id, recording.transcript);

    res.status(202).json({ message: 'AI processing retried', recording });
  } catch (err) {
    console.error('Retry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reusable AI extraction logic
async function runAiExtraction(recordingId, transcript) {
  try {
    console.log(`Manual retry: Extracting summary and todos for: ${recordingId}`);
    const { summary, todos } = await extractWithGemini(transcript);
    
    const recording = await Recording.findByIdAndUpdate(recordingId, {
      summary,
      todoList: todos.map(t => ({ text: t, completed: false })),
      status: 'done'
    }, { new: true });

    if (recording) {
      await createNotification(
        recording.user,
        "AI Summary Ready",
        `AI has generated a summary and tasks for "${recording.title}".`,
        "success",
        "/dashboard/transcript"
      );

      // Fetch user and send email
      try {
        const user = await User.findById(recording.user);
        if (user && user.email) {
          await sendTranscriptionReadyEmail(user.email, user.name, recording);
        }
      } catch (emailErr) {
        console.error('Transcription ready email failed:', emailErr.message);
      }
    }
    
    console.log(`Manual retry successful for recording: ${recordingId}`);
  } catch (err) {
    console.error('AI retry failed:', err.message);
    const recording = await Recording.findByIdAndUpdate(recordingId, { status: 'done' }); 
    if (recording) {
        await createNotification(
            recording.user,
            "AI Processing Limited",
            `We couldn't generate a summary for "${recording.title}" right now, but your transcript is ready.`,
            "warning",
            "/dashboard/transcript"
        );
    }
  }
}

// Background processing function
async function processRecording(recordingId, audioUrl) {
  console.log(`Starting background processing for recording: ${recordingId}`);
  try {
    console.log(`Step 1: Requesting transcription from AssemblyAI...`);
    const transcript = await transcribeWithAssemblyAI(audioUrl);

    if (!transcript) {
      console.error(`Transcription failed: No transcript returned.`);
      const recording = await Recording.findByIdAndUpdate(recordingId, { status: 'failed' });
      if (recording) {
        await createNotification(recording.user, "Transcription Failed", `We couldn't transcribe "${recording.title}".`, "error");
      }
      return;
    }
    console.log(`Step 2: Transcription complete. Length: ${transcript.length} chars.`);

    // IMPORTANT: Save the transcript immediately so it's not lost if Gemini fails
    const recording = await Recording.findByIdAndUpdate(recordingId, { transcript });
    console.log(`Transcript saved to database for recording: ${recordingId}`);

    if (recording) {
        await createNotification(
            recording.user, 
            "Transcription Ready", 
            `Transcription for "${recording.title}" is complete.`, 
            "info", 
            "/dashboard/transcript"
        );
    }

    console.log(`Step 3: Extracting summary and todos with Gemini...`);
    await runAiExtraction(recordingId, transcript);

  } catch (err) {
    console.error('Processing error details:', err.response?.data || err.message);
    const recording = await Recording.findByIdAndUpdate(recordingId, { status: 'failed' });
     if (recording) {
        await createNotification(recording.user, "Processing Error", `An error occurred while processing "${recording.title}".`, "error");
      }
  }
}

// AssemblyAI transcription from URL - fixed with speech_model
async function transcribeWithAssemblyAI(audioUrl) {
  const key = process.env.ASSEMBLY_API_KEY;

  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { 
      audio_url: audioUrl,
      speech_models: ['universal-2']
    },
    { headers: { authorization: key } }
  );

  const transcriptId = transcriptRes.data.id;
  console.log(`Transcription job created: ${transcriptId}`);

  // Poll until done
  let startTime = Date.now();
  while (true) {
    const pollingRes = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: key } }
    );

    const status = pollingRes.data.status;
    console.log(`Transcription status: ${status} (${Math.round((Date.now() - startTime) / 1000)}s)`);

    if (status === 'completed') {
      return pollingRes.data.text;
    } else if (status === 'error') {
      throw new Error(pollingRes.data.error);
    }

    await new Promise(r => setTimeout(r, 3000));
  }
}

// Gemini extraction
async function extractWithGemini(transcript) {
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean);
  
  console.log(`[Gemini] Starting extraction for transcript (${transcript.length} chars) using ${keys.length} available keys.`);

  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const key = keys[keyIndex];
    const maxRetries = 3;

    console.log(`[Gemini] Using Key ${keyIndex + 1} (ending in ...${key.substring(key.length - 4)})`);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`[Gemini] Attempt ${attempt + 1}: Sending request to Gemini 2.5-Flash...`);
        
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`,
          {
            contents: [{ parts: [{ text: `You are a productivity assistant. Analyze this transcript and return a JSON object with:
              1. "summary": A concise 3-sentence summary of the main points.
              2. "todos": An array of actionable tasks found in the text.

              Transcript:
              ${transcript}

              Return ONLY valid JSON in this format: {"summary": "...", "todos": ["...", "..."]}` }] }],
            generationConfig: {
              temperature: 0.2
            }
          }
        );

        console.log(`[Gemini] Response status: ${res.status}`);

        if (!res.data || !res.data.candidates || !res.data.candidates[0]) {
          throw new Error('Malformed response from Gemini API');
        }

        const text = res.data.candidates[0].content.parts[0].text;
        console.log(`[Gemini] Text received. Parsing...`);

        // Use regex to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error(`[Gemini] No JSON found in text: ${text.substring(0, 100)}...`);
          throw new Error('Invalid JSON format in AI response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`[Gemini] Success! Extracted ${parsed.todos?.length || 0} todos.`);
        return parsed;

      } catch (err) {
        const statusCode = err.response?.status;
        const errorMsg = err.response?.data?.error?.message || err.message;
        
        console.error(`[Gemini] Attempt ${attempt + 1} failed: [${statusCode}] ${errorMsg}`);

        if (statusCode === 429 && attempt === maxRetries - 1 && keyIndex < keys.length - 1) {
          console.log(`[Gemini] Key ${keyIndex + 1} exhausted. Moving to next key.`);
          break;
        }

        if (attempt === maxRetries - 1) {
          if (keyIndex === keys.length - 1) throw err;
        } else {
          const waitTime = Math.pow(2, attempt) * 2000;
          console.log(`[Gemini] Retrying in ${waitTime}ms...`);
          await new Promise(r => setTimeout(r, waitTime));
        }
      }
    }
  }
}
