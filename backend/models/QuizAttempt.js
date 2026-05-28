const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
  questionIndex: { type: Number, required: true },
  questionText:  { type: String, default: '' },
  selectedText:  { type: String, default: '' },
  correctText:   { type: String, default: '' },
  isCorrect:     { type: Boolean, required: true },
}, { _id: false });

const quizAttemptSchema = new Schema({
  user:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:            { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  status:          { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  currentQuestion: { type: Number, default: 0 },   // index de la prochaine question à répondre
  score:           { type: Number, default: 0 },
  answers:         [answerSchema],                  // réponses déjà données
  startedAt:       { type: Date, default: Date.now },
  completedAt:     { type: Date, default: null },
}, { timestamps: true });

// Un seul document par (user, quiz) — on l'écrase à chaque sauvegarde
quizAttemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
