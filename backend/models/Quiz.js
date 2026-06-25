const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [optionSchema],
  explanation: { type: String, default: '' },
  type: { type: String, enum: ['qcm', 'qroc'], default: 'qcm' }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  semester: { type: String, default: '', trim: true },
  category: { type: String, required: true, trim: true },
  chapter:  { type: String, default: '', trim: true },
  questions: [questionSchema],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  duration: { type: Number, default: 15 },
  isPublished:   { type: Boolean, default: true },
  isPersonal:    { type: Boolean, default: false },
  isAIGenerated: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
