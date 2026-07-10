const router = require('express').Router();
const {
  register, login, logout, getMe, updateProfile, updateAvatar, ping,
  verifyEmail, resendCode, forgotPassword, resetPassword, completeOnboarding,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.nursesprep.fr';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'https://api.nursesprep.fr/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
      let isNew = false;
      if (!user) {
        user = await User.create({
          name:          profile.displayName,
          email,
          googleId:      profile.id,
          emailVerified: true,
          avatar:        profile.photos?.[0]?.value || '',
        });
        isNew = true;
      } else if (!user.googleId) {
        user.googleId = profile.id;
        if (!user.avatar) user.avatar = profile.photos?.[0]?.value || '';
        await user.save();
      }
      done(null, user, { isNew });
    } catch (err) { done(err, null); }
  }));
}

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google OAuth non configuré' });
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) return res.redirect(`${FRONTEND_URL}/login?error=google`);
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google` }, (err, user, info) => {
    if (err || !user) return res.redirect(`${FRONTEND_URL}/login?error=google`);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const newParam = info?.isNew ? '&isNew=1' : '';
    res.redirect(`${FRONTEND_URL}/auth/google/success?token=${token}${newParam}`);
  })(req, res, next);
});

const today = () => new Date().toISOString().split('T')[0];

async function resetDailyIfNeeded(userId) {
  const t = today();
  await User.updateOne(
    { _id: userId, 'dailyProgress.date': { $ne: t } },
    { $set: { 'dailyProgress.date': t, 'dailyProgress.quiz': 0, 'dailyProgress.flashcards': 0, 'dailyProgress.exercises': 0 } }
  );
}

router.get('/daily', protect, async (req, res) => {
  try {
    await resetDailyIfNeeded(req.user._id);
    const user = await User.findById(req.user._id).select('goals dailyProgress');
    res.json({
      goals:  user.goals  || { quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 },
      daily:  user.dailyProgress || { quiz: 0, flashcards: 0, exercises: 0 },
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/goals', protect, async (req, res) => {
  try {
    const { quizPerDay, flashcardsPerDay, exercisesPerDay } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      'goals.quizPerDay':       Math.max(1, Math.min(500, +quizPerDay       || 5)),
      'goals.flashcardsPerDay': Math.max(1, Math.min(999, +flashcardsPerDay || 20)),
      'goals.exercisesPerDay':  Math.max(1, Math.min(200, +exercisesPerDay  || 3)),
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Préférences utilisateur (thème + couleur) ──────────────────────────── */
router.get('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    res.json(user.preferences || { colorTheme: 'violet', darkMode: false });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/preferences', protect, async (req, res) => {
  try {
    const { colorTheme, darkMode } = req.body;
    const update = {};
    const VALID = ['violet','blue','green','orange','red','yellow'];
    if (colorTheme && VALID.includes(colorTheme)) update['preferences.colorTheme'] = colorTheme;
    if (typeof darkMode === 'boolean') update['preferences.darkMode'] = darkMode;
    if (Object.keys(update).length) {
      await User.findByIdAndUpdate(req.user._id, { $set: update });
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/register',         register);
router.post('/verify-email',     verifyEmail);
router.post('/resend-code',      resendCode);
router.post('/forgot-password',  forgotPassword);
router.post('/reset-password',   resetPassword);
router.post('/login',            login);
router.post('/logout',           protect, logout);
router.get('/me',                protect, getMe);
router.post('/onboarding-complete', protect, completeOnboarding);
router.put('/profile',           protect, updateProfile);
router.post('/ping',             protect, ping);
router.put('/avatar',            protect, updateAvatar);
router.delete('/account',        protect, deleteAccount);

module.exports = router;
