import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '../../lib/api';
import { FiMic, FiTag, FiTrash2, FiSave, FiClock, FiPlay, FiPause } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import pauseicon from '../../Images/frrpause.svg';
import recordicon from '../../Images/frmicrophone.svg';
import stopicon from '../../Images/frrstop.svg';

/**
 * VoiceMemoRecorder Component
 * Purpose: Handles live audio recording, real-time transcription, and saving to custom backend.
 */
const VoiceMemoRecorder = () => {
  
  // ================= STATE =================
  const [recordingState, setRecordingState] = useState("READY TO RECORD"); 
  const [recordingTime, setRecordingTime] = useState(0);                   
  const [waveformBars, setWaveformBars] = useState(Array(20).fill(20));    
  const [transcript, setTranscript] = useState("");                         

  // Confirmation Modal States
  const [showPreview, setShowPreview] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState("");
  const [previewBlob, setPreviewBlob] = useState(null);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingTag, setRecordingTag] = useState("Meeting");
  const [customTag, setCustomTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const navigate = useNavigate();
  const audioPreviewRef = useRef(null);

  // ================= REFS (Persistent non-triggering state) =================
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);


  // ================= SIDE EFFECTS =================

  // Initialize Speech Recognition (Browser API) - Used for real-time visual feedback, 
  // though backend handles final transcription.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + " ";
        }
        setTranscript(text);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  // Timer Control Logic
  useEffect(() => {
    if (recordingState === "recording") {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [recordingState]);


  // ================= HELPER FUNCTIONS =================

  // Formats seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Logic for the animated waveform visualization
  const startWaveform = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      const bars = Array.from(dataArray).slice(0, 20).map((v) => (v / 255) * 100);
      setWaveformBars(bars);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };


  // ================= EVENT HANDLERS =================

  // START RECORDING
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];
      setTranscript("");

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.start();
      recognitionRef.current?.start();

      // Audio Context for Waveform
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") await audioContext.resume();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      source.connect(analyser);
      
      startWaveform();
      setRecordingState("recording");
    } catch (err) {
      alert("Microphone access is required to record.");
    }
  };

  // PAUSE / RESUME
  const handlePause = () => {
    mediaRecorderRef.current?.pause();
    recognitionRef.current?.stop();
    cancelAnimationFrame(animationRef.current);
    setRecordingState("paused");
  };

  const handleResume = () => {
    mediaRecorderRef.current?.resume();
    recognitionRef.current?.start();
    startWaveform();
    setRecordingState("recording");
  };

  // STOP RECORDING (Now shows preview instead of auto-saving)
  const handleStop = () => {
    mediaRecorderRef.current.onstop = () => {
      const mimeType = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      
      setPreviewBlob(blob);
      setPreviewAudioUrl(URL.createObjectURL(blob));
      setRecordingTitle(`New Memo - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setShowPreview(true);
      setRecordingState("READY TO RECORD");
    };

    mediaRecorderRef.current.stop();
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(animationRef.current);
    clearInterval(intervalRef.current);
  };

  // DISCARD RECORDING
  const handleDiscard = () => {
    if (!window.confirm("Are you sure you want to discard this recording?")) return;
    
    // Cleanup
    URL.revokeObjectURL(previewAudioUrl);
    setPreviewAudioUrl("");
    setPreviewBlob(null);
    setShowPreview(false);
    setRecordingTime(0);
  };

  // FINAL SAVE & UPLOAD
  const handleFinalSave = async () => {
    if (!recordingTitle.trim()) {
      alert("Please enter a title.");
      return;
    }

    try {
      setIsSaving(true);
      const finalTag = recordingTag === "Others" ? customTag : recordingTag;
      
      const formData = new FormData();
      formData.append('audio', previewBlob, `recording-${Date.now()}.mp4`);
      formData.append('title', recordingTitle);
      formData.append('duration', recordingTime);
      formData.append('tag', finalTag || 'Meeting');

      const data = await api.post('/recordings/upload', formData, true);

      // Store in localStorage for immediate access
      localStorage.setItem("latestRecording", JSON.stringify(data.recording));

      // Cleanup and Redirect
      URL.revokeObjectURL(previewAudioUrl);
      setShowPreview(false);
      setRecordingTime(0);
      navigate("/dashboard/transcript");

    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save recording.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreviewPlayback = () => {
    if (isPreviewPlaying) {
      audioPreviewRef.current?.pause();
    } else {
      audioPreviewRef.current?.play();
    }
    setIsPreviewPlaying(!isPreviewPlaying);
  };


  // ================= MAIN UI RENDER =================
  return (
    <div className="flex items-center justify-center mt-5 font-geist overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 w-full max-w-md flex flex-col items-center"
      >

        {/* STATUS BADGE */}
        <motion.div 
          initial={false}
          animate={{ 
            backgroundColor: recordingState === "recording" ? "#D4D4FE" : 
                            recordingState === "paused" ? "#FED3D4" : "#E9E9FF",
            color: recordingState === "recording" ? "#4C4CFB" : 
                   recordingState === "paused" ? "#FC464A" : "#808080"
          }}
          className="mb-4 text-[18px] font-extrabold flex items-center gap-3 rounded-full px-6 py-2.5 shadow-sm"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`h-3 w-3 rounded-full ${recordingState === "recording" ? "bg-[#4C4CFB]" : recordingState === "paused" ? "bg-[#FC464A]" : "bg-[#808080]"}`}
          />
          <span className="tracking-tight uppercase">{recordingState}</span>
        </motion.div>        
      
        {/* MAIN RECORD BUTTON */}
        <div className="relative">
            <AnimatePresence>
                {recordingState === "recording" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.4 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-[#2828FA]/20 rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartRecording}
            disabled={recordingState !== "READY TO RECORD"}
            className="w-44 h-44 mt-10 flex items-center justify-center relative z-10"
            >
            <motion.img
                initial={false}
                animate={{ 
                    backgroundColor: recordingState === "paused" ? "#FB2126" : "#2828FA",
                    rotate: recordingState === "recording" ? [0, 5, -5, 0] : 0
                }}
                transition={{ rotate: { repeat: Infinity, duration: 2 } }}
                src={recordingState === "paused" ? pauseicon : recordicon}
                alt="recorder button"
                className="rounded-full p-16 shadow-2xl shadow-blue-900/20"
            />
            </motion.button>
        </div>

        <div className="mt-10 h-10 flex items-center">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={recordingState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-[#555555] font-bold text-center uppercase tracking-widest"
                >
                    {recordingState === "READY TO RECORD" && "Tap to Start Recording"}
                    {recordingState === "recording" && "Capture is active..."}
                    {recordingState === "paused" && "Recording is paused"}
                    {recordingState === "processing" && "Generating your summary..."}
                </motion.p>
            </AnimatePresence>
        </div>

        {/* TIMER & WAVEFORM */}
        <div className="h-16 flex items-center justify-center">
            {(recordingState === "recording" || recordingState === "paused") && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-black text-gray-800 tracking-tighter"
            >
                {formatTime(recordingTime)}
            </motion.div>
            )}
        </div>

        <div className="w-full bg-white rounded-3xl p-6 mt-4 border-2 border-gray-50 shadow-xl shadow-blue-900/5">
          <div className="flex gap-1.5 h-16 items-center justify-center">
            {waveformBars.map((h, i) => (
              <motion.div 
                key={i} 
                animate={{ height: `${Math.max(15, h)}%` }}
                className={`w-2 rounded-full transition-colors duration-300 ${recordingState === 'recording' ? 'bg-[#4C4CFB]' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>

        {/* CONTROLS (VISIBLE WHEN RECORDING) */}
        <div className="h-20 mt-8">
            <AnimatePresence>
                {recordingState !== "READY TO RECORD" && recordingState !== "processing" && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={recordingState === "recording" ? handlePause : handleResume}
                        className="px-8 py-3.5 text-[15px] flex items-center gap-3 font-extrabold bg-white text-gray-800 border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 transition-all"
                    >
                        {recordingState === "recording" ? 
                        <div className="p-1 bg-gray-800 rounded-lg"><img className="size-3" src={pauseicon} alt="" /></div> : 
                        <div className="p-1 bg-blue-600 rounded-lg"><img className="size-3" src={recordicon} alt="" /></div> }
                        
                        {recordingState === "recording" ? "PAUSE" : "RESUME"}
                    </motion.button>

                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "#FB2126" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStop} 
                        className="px-8 py-3.5 flex items-center gap-3 font-extrabold bg-[#FB2126] text-white rounded-2xl shadow-xl shadow-red-100 transition-all"
                    >
                        <img className="size-5 brightness-200" src={stopicon} alt="" /> STOP
                    </motion.button>
                </motion.div>
                )}
            </AnimatePresence>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center font-bold mt-8 text-gray-400 text-[10px] uppercase tracking-[0.2em] px-8"
        >
          <p>Memo AI handles transcription & summarization automatically.</p>
        </motion.div>

      </motion.div>

      {/* ================= CONFIRMATION MODAL ================= */}
      <AnimatePresence>
        {showPreview && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleDiscard}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white w-full max-w-lg rounded-4xl overflow-hidden shadow-2xl relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Modal Header */}
                    <div className="bg-blue-50/50 p-8 border-b border-gray-100">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Review Memo</h2>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Finalize details before AI processing</p>
                    </div>

                    <div className="p-8 space-y-8">
                        
                        {/* Audio Player Card */}
                        <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-100">
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                                    <FiMic size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-gray-800 tracking-tight">Voice Recording</p>
                                    <p className="text-xs font-bold text-gray-400 mt-0.5 flex items-center gap-1.5 uppercase">
                                        <FiClock size={12} className="text-blue-500" /> {formatTime(recordingTime)}
                                    </p>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={togglePreviewPlayback}
                                className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/5 hover:bg-blue-600 hover:text-white transition-all duration-300"
                            >
                                {isPreviewPlaying ? <FiPause size={28} /> : <FiPlay size={28} className="ml-1" />}
                            </motion.button>
                            </div>
                            <audio 
                                ref={audioPreviewRef} 
                                src={previewAudioUrl} 
                                onEnded={() => setIsPreviewPlaying(false)}
                                className="hidden"
                            />
                        </div>

                        {/* Editable Fields */}
                        <div className="space-y-6">
                            
                            {/* Title Input */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Recording Title</label>
                                <input 
                                    type="text" 
                                    value={recordingTitle}
                                    onChange={(e) => setRecordingTitle(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-gray-800"
                                    placeholder="Give your memo a name..."
                                />
                            </div>

                            {/* Tag Selection */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">Categorize</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {["Meeting", "Lecture", "Conference", "Interview", "Client", "Others"].map((tag) => (
                                    <motion.button
                                        key={tag}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setRecordingTag(tag)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all duration-300
                                        ${recordingTag === tag 
                                            ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200" 
                                            : "bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-600"}`}
                                    >
                                        {tag}
                                    </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Tag Input */}
                            <AnimatePresence>
                                {recordingTag === "Others" && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden pt-2"
                                    >
                                        <input 
                                            type="text" 
                                            value={customTag}
                                            onChange={(e) => setCustomTag(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold"
                                            placeholder="Enter custom category name..."
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-8 bg-gray-50/50 flex gap-4 border-t border-gray-100">
                        <motion.button 
                            whileHover={{ scale: 1.02, backgroundColor: "#fee2e2" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDiscard}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-100 text-red-500 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all disabled:opacity-50"
                        >
                            <FiTrash2 size={16} /> Discard
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.02, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleFinalSave}
                            disabled={isSaving}
                            className="flex-2 flex items-center justify-center gap-3 py-4 bg-[#2828FA] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all disabled:opacity-50 shadow-2xl shadow-blue-200"
                        >
                            {isSaving ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                                />
                            ) : <FiSave size={16} />}
                            {isSaving ? "SAVING..." : "Save & Process"}
                        </motion.button>
                    </div>

                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceMemoRecorder;