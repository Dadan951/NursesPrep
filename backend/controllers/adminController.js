const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const Exercise = require('../models/Exercise');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, freeUsers, proUsers, premiumUsers, totalQuizzes, totalFlashcards, totalExercises] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', 'progress.lastActivity': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ role: 'student', subscription: 'free' }),
      User.countDocuments({ role: 'student', subscription: 'pro' }),
      User.countDocuments({ role: 'student', subscription: 'premium' }),
      Quiz.countDocuments(),
      Flashcard.countDocuments(),
      Exercise.countDocuments()
    ]);
    res.json({ totalUsers, activeUsers, freeUsers, proUsers, premiumUsers, totalQuizzes, totalFlashcards, totalExercises });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role && req.query.role !== 'all') filter.role = req.query.role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const allowed = ['subscription', 'role', 'name'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
