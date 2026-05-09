const express = require('express');
const {
  uploadMiddleware,
  uploadRecording,
  getRecordings,
  getRecordingById,
  updateRecording,
  updateRecordingTodo,
  deleteRecording,
  retryAIProcessing
} = require('../controllers/recording.controller');
const  protect  = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
 .get(getRecordings);

router.route('/upload')
 .post(uploadMiddleware, uploadRecording);

router.route('/:id')
 .get(getRecordingById)
 .patch(updateRecording)
 .delete(deleteRecording);

router.route('/:id/todos/:todoId')
 .patch(updateRecordingTodo);

router.patch('/:id/retry-ai', retryAIProcessing);

module.exports = router;

