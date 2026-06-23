export const ACTIVE_RECORDING_STATUSES = [
  'uploaded',
  'processing',
  'transcribing',
  'transcript_ready',
  'summarizing',
];

export const isRecordingActive = (status) => ACTIVE_RECORDING_STATUSES.includes(status);

export const isRecordingComplete = (status) => status === 'complete' || status === 'done';

export const getRecordingStatusMeta = (status) => {
  switch (status) {
    case 'uploaded':
      return {
        label: 'Uploaded',
        message: 'Audio uploaded successfully. Preparing transcription...',
      };
    case 'transcribing':
    case 'processing':
      return {
        label: 'Transcribing',
        message: 'Transcribing your recording...',
      };
    case 'transcript_ready':
      return {
        label: 'Transcript Ready',
        message: 'Transcript ready. Preparing AI summary...',
      };
    case 'summarizing':
      return {
        label: 'Summarizing',
        message: 'Generating summary and action items...',
      };
    case 'complete':
    case 'done':
      return {
        label: 'Ready',
        message: 'Your memo is ready.',
      };
    case 'failed':
      return {
        label: 'Failed',
        message: 'Processing failed. Please try again.',
      };
    default:
      return {
        label: 'Pending',
        message: 'Preparing your memo...',
      };
  }
};
