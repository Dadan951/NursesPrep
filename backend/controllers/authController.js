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
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress, avatar: user.avatar || '' } });
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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress, avatar: user.avatar || '' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress, avatar: user.avatar || '' } });
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'Image manquante' });
    // Vérifier que c'est bien une image base64 (max ~500KB)
    if (avatar.length > 700000) return res.status(400).json({ message: 'Image trop grande (max 500 KB)' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    res.json({ message: 'Photo mise à jour', avatar: user.avatar,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ping = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Charger l'utilisateur
    const user = await User.findById(userId);
    const lastDate = user.progress?.lastActivity
      ? new Date(user.progress.lastActivity).toISOString().split('T')[0]
      : null;

    // Calculer le nouveau streak
    let newStreak = user.progress?.streak || 0;
    let shouldUpdate = false;

    if (lastDate === today) {
      // Déjà visité aujourd'hui — corriger si streak est 0 (données corrompues)
      if (newStreak === 0) { newStreak = 1; shouldUpdate = true; }
    } else if (lastDate === yesterday) {
      newStreak = newStreak + 1;
      shouldUpdate = true;
    } else {
      newStreak = 1;
      shouldUpdate = true;
    }

    // Mettre à jour streak + lastActivity avec $set (fiable, pas de markModified)
    if (shouldUpdate) {
      await User.updateOne(
        { _id: userId },
        { $set: { 'progress.streak': newStreak, 'progress.lastActivity': new Date() } }
      );
    }

    // Incrémenter ou créer l'entrée du jour dans dailyActivity
    const hasToday = user.dailyActivity.some(e => e.date === today);
    if (hasToday) {
      await User.updateOne(
        { _id: userId, 'dailyActivity.date': today },
        { $inc: { 'dailyActivity.$.count': 1 } }
      );
    } else {
      await User.updateOne(
        { _id: userId },
        { $push: { dailyActivity: { date: today, count: 1 } } }
      );
    }

    // Recharger l'utilisateur final
    const updated = await User.findById(userId);

    // Garder max 30 jours (si dépassé)
    if (updated.dailyActivity.length > 30) {
      await User.updateOne({ _id: userId }, { $pop: { dailyActivity: -1 } });
    }

    // Retourner les 7 derniers jours
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const entry = updated.dailyActivity.find(e => e.date === d);
      weeklyActivity.push(entry ? entry.count : 0);
    }

    res.json({
      streak: updated.progress.streak,
      weeklyActivity,
      user: { id: updated._id, name: updated.name, email: updated.email, role: updated.role, subscription: updated.subscription, progress: updated.progress, avatar: updated.avatar || '' }
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
      user: { id: user._id, name: user.name, email: user.email, role: user.role, subscription: user.subscription, progress: user.progress, avatar: user.avatar || '' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
