const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  semester: { type: String, default: '', trim: true },
  category: { type: String, required: true, trim: true },
  chapter:  { type: String, default: '', trim: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  hint: { type: String, default: '' },
  isPublished:   { type: Boolean, default: true },
  isAIGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
