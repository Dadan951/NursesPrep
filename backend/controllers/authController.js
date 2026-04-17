const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress } });
};

exports.ping = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastDate = user.progress.lastActivity
      ? user.progress.lastActivity.toISOString().split('T')[0]
      : null;

    // Mise à jour de la série (streak)
    if (lastDate === today) {
      // Déjà visité aujourd'hui → pas de changement
    } else if (lastDate === yesterday) {
      // Jour consécutif → +1
      user.progress.streak = (user.progress.streak || 0) + 1;
      user.progress.lastActivity = new Date();
    } else {
      // Premier jour ou série cassée → reset à 1
      user.progress.streak = 1;
      user.progress.lastActivity = new Date();
    }

    // Enregistrer l'activité du jour
    const existing = user.dailyActivity.find(e => e.date === today);
    if (existing) {
      existing.count += 1;
    } else {
      user.dailyActivity.push({ date: today, count: 1 });
    }

    // Garder seulement les 30 derniers jours
    if (user.dailyActivity.length > 30) {
      user.dailyActivity = user.dailyActivity.slice(-30);
    }

    await user.save();

    // Retourner les 7 derniers jours d'activité
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const entry = user.dailyActivity.find(e => e.date === d);
      weeklyActivity.push(entry ? entry.count : 0);
    }

    res.json({
      streak: user.progress.streak,
      weeklyActivity,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name && name.trim()) user.name = name.trim();

    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      user.email = email.toLowerCase().trim();
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Le mot de passe actuel est requis' });
      const valid = await user.comparePassword(currentPassword);
      if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
      user.password = newPassword;
    }

    await user.save();
    res.json({
      message: 'Profil mis à jour avec succès',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
