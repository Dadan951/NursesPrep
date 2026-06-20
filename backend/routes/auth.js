const router = require('express').Router();
const {
  register, login, logout, getMe, updateProfile, updateAvatar, ping,
  verifyEmail, resendCode, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

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

router.post('/register',         register);
router.post('/verify-email',     verifyEmail);
router.post('/resend-code',      resendCode);
router.post('/forgot-password',  forgotPassword);
router.post('/reset-password',   resetPassword);
router.post('/login',            login);
router.post('/logout',           protect, logout);
router.get('/me',                protect, getMe);
router.put('/profile',           protect, updateProfile);
router.post('/ping',             protect, ping);
router.put('/avatar',            protect, updateAvatar);

module.exports = router;
