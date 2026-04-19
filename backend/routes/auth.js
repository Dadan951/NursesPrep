const router = require('express').Router();
const {
  register, login, getMe, updateProfile, updateAvatar, ping,
  verifyEmail, resendCode, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',         register);
router.post('/verify-email',     verifyEmail);
router.post('/resend-code',      resendCode);
router.post('/forgot-password',  forgotPassword);
router.post('/reset-password',   resetPassword);
router.post('/login',            login);
router.get('/me',                protect, getMe);
router.put('/profile',           protect, updateProfile);
router.post('/ping',             protect, ping);
router.put('/avatar',            protect, updateAvatar);

module.exports = router;
