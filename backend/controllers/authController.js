const jwt         = require('jsonwebtoken');
const User        = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const email       = require('../services/emailService');
const { parseUA, getIP } = require('../utils/parseUA');

async function log(action, req, user = null, extraEmail = '') {
  try {
    const ua = req.headers['user-agent'] || '';
    const { device, browser, os } = parseUA(ua);
    await ActivityLog.create({
      user:      user?._id || null,
      userEmail: user?.email || extraEmail,
      userName:  user?.name || '',
      action,
      ip:        getIP(req),
      userAgent: ua,
      device, browser, os,
    });
  } catch (_) {}
}

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatUser = (u) => ({
  id: u._id, name: u.name, email: u.email,
  role: u.role, subscription: u.subscription,
  progress: u.progress, avatar: u.avatar || '',
  createdAt: u.createdAt,
});

/* Génère un code à 6 chiffres */
const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

/* ── POST /auth/register ─────────────────────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email: emailAddr, password } = req.body;
    if (!name || !emailAddr || !password)
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });

    const existing = await User.findOne({ email: emailAddr });
    if (existing && existing.emailVerified)
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });

    const code    = genCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    if (existing && !existing.emailVerified) {
      // Compte en attente → on met à jour le code
      existing.name     = name.trim();
      existing.password = password;
      existing.verificationCode    = code;
      existing.verificationExpires = expires;
      await existing.save();
    } else {
      await User.create({
        name: name.trim(), email: emailAddr, password,
        emailVerified: false,
        verificationCode: code,
        verificationExpires: expires,
      });
    }

    // Envoi de l'email (non-bloquant — ne fait pas planter l'inscription si ça échoue)
    if (process.env.RESEND_API_KEY) {
      console.log('[Email] Tentative envoi vérification à:', emailAddr);
      email.sendVerificationEmail(emailAddr, name.trim(), code)
        .then(() => console.log('[Email] ✅ Envoyé à:', emailAddr))
        .catch(err => console.error('[Email] ❌ Erreur:', err.message));
    } else {
      console.log('[Email] ⚠️ RESEND_API_KEY manquant — code:', code);
    }

    res.status(201).json({ needsVerification: true, email: emailAddr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/verify-email ─────────────────────────────────────────────── */
exports.verifyEmail = async (req, res) => {
  try {
    const { email: emailAddr, code } = req.body;
    if (!emailAddr || !code)
      return res.status(400).json({ message: 'Email et code requis' });

    const user = await User.findOne({ email: emailAddr });
    if (!user)
      return res.status(404).json({ message: 'Compte introuvable' });
    if (user.emailVerified)
      return res.status(400).json({ message: 'Email déjà vérifié' });
    if (user.verificationCode !== code)
      return res.status(400).json({ message: 'Code incorrect' });
    if (user.verificationExpires < new Date())
      return res.status(400).json({ message: 'Code expiré, demande-en un nouveau' });

    user.emailVerified      = true;
    user.verificationCode   = undefined;
    user.verificationExpires= undefined;
    await user.save();

    const token = signToken(user._id);
    await log('register', req, user);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/resend-code ──────────────────────────────────────────────── */
exports.resendCode = async (req, res) => {
  try {
    const { email: emailAddr, type = 'verification' } = req.body;
    if (!emailAddr)
      return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email: emailAddr });
    if (!user)
      return res.status(404).json({ message: 'Compte introuvable' });

    const code    = genCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    if (type === 'reset') {
      user.resetCode    = code;
      user.resetExpires = expires;
    } else {
      user.verificationCode    = code;
      user.verificationExpires = expires;
    }
    await user.save();

    if (process.env.RESEND_API_KEY) {
      const send = type === 'reset'
        ? email.sendResetEmail(emailAddr, user.name, code)
        : email.sendVerificationEmail(emailAddr, user.name, code);
      send.catch(err => console.error('[Email] Erreur renvoi code:', err.message));
    }

    res.json({ message: 'Code renvoyé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/forgot-password ──────────────────────────────────────────── */
exports.forgotPassword = async (req, res) => {
  try {
    const { email: emailAddr } = req.body;
    if (!emailAddr)
      return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email: emailAddr });
    // On répond toujours OK pour ne pas révéler si l'email existe
    if (!user)
      return res.json({ message: 'Si cet email existe, un code a été envoyé' });

    const code    = genCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode    = code;
    user.resetExpires = expires;
    await user.save();

    if (process.env.RESEND_API_KEY) {
      email.sendResetEmail(emailAddr, user.name, code).catch(err =>
        console.error('[Email] Erreur envoi reset:', err.message)
      );
    }

    res.json({ message: 'Si cet email existe, un code a été envoyé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/reset-password ───────────────────────────────────────────── */
exports.resetPassword = async (req, res) => {
  try {
    const { email: emailAddr, code, newPassword } = req.body;
    if (!emailAddr || !code || !newPassword)
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });

    const user = await User.findOne({ email: emailAddr });
    if (!user)
      return res.status(404).json({ message: 'Compte introuvable' });
    if (user.resetCode !== code)
      return res.status(400).json({ message: 'Code incorrect' });
    if (user.resetExpires < new Date())
      return res.status(400).json({ message: 'Code expiré, demande-en un nouveau' });

    user.password    = newPassword;
    user.resetCode   = undefined;
    user.resetExpires= undefined;
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/login ────────────────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email: emailAddr, password } = req.body;
    if (!emailAddr || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email: emailAddr });
    if (!user || !(await user.comparePassword(password))) {
      await log('login_failed', req, null, emailAddr);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Bloquer uniquement si le compte a un code de vérification en attente
    // (les anciens comptes sans verificationCode passent normalement)
    if (!user.emailVerified && user.verificationCode)
      return res.status(403).json({
        message: 'Vérifie ton email avant de te connecter',
        needsVerification: true,
        email: emailAddr,
      });

    // Anciens comptes non vérifiés → on les marque comme vérifiés
    if (!user.emailVerified) {
      await User.updateOne({ _id: user._id }, { $set: { emailVerified: true } });
    }

    const token = signToken(user._id);
    await log('login', req, user);
    res.json({ token, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/logout ───────────────────────────────────────────────────── */
exports.logout = async (req, res) => {
  try {
    await log('logout', req, req.user);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── GET /auth/me ────────────────────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

/* ── PUT /auth/avatar ────────────────────────────────────────────────────── */
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'Image manquante' });
    if (avatar.length > 700000) return res.status(400).json({ message: 'Image trop grande (max 500 KB)' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    res.json({ message: 'Photo mise à jour', avatar: user.avatar, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /auth/ping ─────────────────────────────────────────────────────── */
exports.ping = async (req, res) => {
  try {
    const userId   = req.user._id;
    const today    = new Date().toISOString().split('T')[0];
    const yesterday= new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const user = await User.findById(userId);
    const lastDate = user.progress?.lastActivity
      ? new Date(user.progress.lastActivity).toISOString().split('T')[0] : null;

    let newStreak = user.progress?.streak || 0;

    if (lastDate === today) {
      // Même jour → rien
    } else if (lastDate === yesterday) {
      newStreak++;
      await User.updateOne({ _id: userId }, { $set: { 'progress.streak': newStreak, 'progress.lastActivity': new Date() } });
    } else {
      newStreak = 0;
      await User.updateOne({ _id: userId }, { $set: { 'progress.streak': 0, 'progress.lastActivity': new Date() } });
    }

    const hasToday = user.dailyActivity.some(e => e.date === today);
    if (hasToday) {
      await User.updateOne({ _id: userId, 'dailyActivity.date': today }, { $inc: { 'dailyActivity.$.count': 1 } });
    } else {
      await User.updateOne({ _id: userId }, { $push: { dailyActivity: { date: today, count: 1 } } });
    }

    const updated = await User.findById(userId);
    if (updated.dailyActivity.length > 30)
      await User.updateOne({ _id: userId }, { $pop: { dailyActivity: -1 } });

    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const entry = updated.dailyActivity.find(e => e.date === d);
      weeklyActivity.push(entry ? entry.count : 0);
    }

    res.json({ streak: updated.progress.streak, weeklyActivity, user: formatUser(updated) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── PUT /auth/profile ───────────────────────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email: emailAddr, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name && name.trim()) user.name = name.trim();

    if (emailAddr && emailAddr !== user.email) {
      const exists = await User.findOne({ email: emailAddr, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      user.email = emailAddr.toLowerCase().trim();
    }

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Le mot de passe actuel est requis' });
      const valid = await user.comparePassword(currentPassword);
      if (!valid) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ message: 'Profil mis à jour avec succès', user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
