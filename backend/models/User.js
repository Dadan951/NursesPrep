const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  subscription: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
  progress: {
    quizCompleted: { type: Number, default: 0 },
    flashcardsReviewed: { type: Number, default: 0 },
    exercisesCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActivity: { type: Date }
  },
  weeklyScores: [{ week: String, score: Number }],
  quizGen: {
    count: { type: Number, default: 0 },
    date: { type: String, default: '' }
  },
  sheetGen: {
    count: { type: Number, default: 0 },
    date: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
