const mongoose = require('mongoose');

const recordingTodoSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false }
});

const recordingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  audioUrl: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    trim: true,
    default: ''
  },
  transcript: {
    type: String,
    trim: true,
    default: ''
  },
  summary: {
    type: String,
    trim: true,
    default: ''
  },
  todoList: {
    type: [recordingTodoSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['processing', 'done', 'failed'],
    default: 'processing'
  }
}, { timestamps: true });

recordingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Recording', recordingSchema);