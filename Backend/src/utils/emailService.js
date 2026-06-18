const brevo = require('../config/email');

/**
 * Sends a notification when transcription and AI analysis are ready.
 */
exports.sendTranscriptionReadyEmail = async (email, name, recording) => {
  console.log(`[EmailService] Attempting to send Transcription Ready email to: ${email} for recording: ${recording.title}`);

  try {
    const duration = `${Math.floor(recording.duration / 60)}m ${recording.duration % 60}s`;
    const actionItems = recording.todoList?.length || 0;
    const frontendUrl = process.env.FRONTEND_URL || 'https://memo-ai-rosy.vercel.app';

    const response = await brevo.transactionalEmails.sendTransacEmail({
      subject: `Your Memo is Ready: ${recording.title}`,
      templateId: 9,
      params: {
        NAME: name,
        RECORDING_TITLE: recording.title,
        SUMMARY: recording.summary || 'Summary generated and ready for review.',
        DURATION: duration,
        ACTION_ITEMS: actionItems,
        TRANSCRIPT_URL: `${frontendUrl}/dashboard/transcript`
      },
      sender: { name: 'MEMO AI', email: 'kpatakousman10@gmail.com' },
      to: [{ email, name }],
    });

    console.log(`[EmailService] Transcription Ready email sent successfully to ${email}. MessageId: ${response.messageId}`);
  } catch (error) {
    console.error(`[EmailService] Failed to send Transcription Ready email to ${email}:`, error.response?.data || error.body || error.message);
  }
};
