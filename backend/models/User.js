const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null },
  googleId:  { type: String, default: null },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  subscription:         { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
  stripeCustomerId:     { type: String, default: null },
  stripeSubscriptionId: { type: String, default: null },
  progress: {
    quizCompleted: { type: Number, default: 0 },
    flashcardsReviewed: { type: Number, default: 0 },
    flashcardsUnknown: { type: Number, default: 0 },
    exercisesCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActivity: { type: Date }
  },
  weeklyScores: [{ week: String, score: Number }],
  dailyActivity: [{ date: String, count: { type: Number, default: 0 } }],
  goals: {
    quizPerDay:        { type: Number, default: 5 },
    flashcardsPerDay:  { type: Number, default: 20 },
    exercisesPerDay:   { type: Number, default: 3 },
  },
  dailyProgress: {
    date:       { type: String, default: '' },
    quiz:       { type: Number, default: 0 },
    flashcards: { type: Number, default: 0 },
    exercises:  { type: Number, default: 0 },
  },
  monthlyQuiz: {
    count: { type: Number, default: 0 },
    month: { type: String, default: '' }
  },
  monthlyExercise: {
    count: { type: Number, default: 0 },
    month: { type: String, default: '' }
  },
  quizGen: {
    count: { type: Number, default: 0 },
    date: { type: String, default: '' }
  },
  sheetGen: {
    count: { type: Number, default: 0 },
    date: { type: String, default: '' }
  },
  avatar: { type: String, default: '' },
  pushSubscription: { type: mongoose.Schema.Types.Mixed, default: null },
  pushEnabled: { type: Boolean, default: false },
  emailVerified:      { type: Boolean, default: false },
  verificationCode:   { type: String },
  verificationExpires:{ type: Date },
  resetCode:          { type: String },
  resetExpires:       { type: Date },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
