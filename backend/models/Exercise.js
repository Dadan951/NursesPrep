const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  answer: { type: String, default: '' },
  semester: { type: String, default: '' },
  caseType: { type: String, default: '' },
  category: { type: String, required: true },
  type: { type: String, enum: ['qcm', 'open', 'case_study'], default: 'open' },
  options: [{ text: String, isCorrect: Boolean }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
