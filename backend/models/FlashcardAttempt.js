const mongoose = require('mongoose');
const { Schema } = mongoose;

const unknownCardSchema = new Schema({
  front: { type: String, default: '' },
  back:  { type: String, default: '' },
}, { _id: false });

const flashcardAttemptSchema = new Schema({
  user:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
  semester:     { type: String, required: true },
  ue:           { type: String, required: true },
  chapter:      { type: String, required: true },
  part:         { type: String, default: '' },
  status:       { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  currentIndex: { type: Number, default: 0 },
  known:        { type: Number, default: 0 },
  unknown:      { type: Number, default: 0 },
  total:        { type: Number, default: 0 },
  unknownCards: [unknownCardSchema],   // cartes marquées "Je ne savais pas"
  startedAt:    { type: Date, default: Date.now },
  completedAt:  { type: Date, default: null },
}, { timestamps: true });

// Un seul document par (user, semester, ue, chapter, part)
flashcardAttemptSchema.index(
  { user: 1, semester: 1, ue: 1, chapter: 1, part: 1 },
  { unique: true }
);

module.exports = mongoose.model('FlashcardAttempt', flashcardAttemptSchema);
