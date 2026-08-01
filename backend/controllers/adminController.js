const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const Exercise = require('../models/Exercise');
const SubscriptionEvent = require('../models/SubscriptionEvent');

// Garder synchronisé avec les tarifs affichés sur Subscription.jsx / CGU.jsx
const PLAN_PRICE = { pro: 9.99, premium: 14.99 };

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

    const mrr  = proUsers * PLAN_PRICE.pro + premiumUsers * PLAN_PRICE.premium;
    const arpu = totalUsers > 0 ? mrr / totalUsers : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const events30d = await SubscriptionEvent.find({ createdAt: { $gte: thirtyDaysAgo } }).select('type');
    const newSubs30d    = events30d.filter(e => e.type === 'new').length;
    const upgrades30d   = events30d.filter(e => e.type === 'upgrade').length;
    const downgrades30d = events30d.filter(e => e.type === 'downgrade').length;
    const canceled30d   = events30d.filter(e => e.type === 'canceled').length;
    const paidUsers = proUsers + premiumUsers;
    // Approximation : annulations / (abonnés payants actuels + annulés sur la période).
    // Devient plus fiable à mesure que l'historique s'accumule (pas de snapshot j-30 disponible).
    const churnRate30d = (paidUsers + canceled30d) > 0
      ? Math.round((canceled30d / (paidUsers + canceled30d)) * 1000) / 10
      : 0;

    res.json({
      totalUsers, activeUsers, freeUsers, proUsers, premiumUsers, totalQuizzes, totalFlashcards, totalExercises,
      mrr: Math.round(mrr * 100) / 100,
      arpu: Math.round(arpu * 100) / 100,
      newSubs30d, upgrades30d, downgrades30d, canceled30d, churnRate30d,
    });
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
    const allowed = ['subscription', 'role', 'name', 'suspendedUntil'];
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
