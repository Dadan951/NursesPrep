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
