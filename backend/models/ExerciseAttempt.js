const mongoose = require('mongoose');

const exerciseAttemptSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise:    { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  isCorrect:   { type: Boolean, default: null }, // null = pas de correction automatique (ouvert / cas clinique)
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

exerciseAttemptSchema.index({ user: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model('ExerciseAttempt', exerciseAttemptSchema);
