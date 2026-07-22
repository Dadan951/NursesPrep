const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  answer: { type: String, default: '' },
  semester: { type: String, default: '', trim: true },
  programVersion: { type: String, enum: ['ancien', 'reforme_2026'], default: 'ancien' },
  caseType: { type: String, default: '', trim: true },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['qcm', 'open', 'case_study'], default: 'open' },
  options: [{ text: String, isCorrect: Boolean }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
