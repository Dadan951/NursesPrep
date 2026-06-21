const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { adminGetGroups, adminDeleteGroup } = require('../controllers/groupController');
const { protect, adminOnly } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

router.use(protect, adminOnly);

router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

/* ── GET /admin/activity-logs ────────────────────────────────────────────── */
router.get('/activity-logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, search } = req.query;
    const filter = {};
    if (action && action !== 'all') filter.action = action;
    if (search) {
      filter.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { userName:  { $regex: search, $options: 'i' } },
        { ip:        { $regex: search, $options: 'i' } },
      ];
    }
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    // Stats rapides
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [todayLogins, todayRegs, todayFailed] = await Promise.all([
      ActivityLog.countDocuments({ action: 'login', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments({ action: 'register', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments({ action: 'login_failed', createdAt: { $gte: todayStart } }),
    ]);

    res.json({ logs, total, page: +page, pages: Math.ceil(total / +limit), stats: { todayLogins, todayRegs, todayFailed } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/groups', adminGetGroups);
router.delete('/groups/:id', adminDeleteGroup);

// ── Seeds Semestre 1 (usage unique, puis peut être retiré) ────────────────
router.post('/seed-s1', require('../seeds/seedSemestre1_route'));
router.post('/seed-flashcards-s1', require('../seeds/seedFlashcardsSemestre1_route'));
router.post('/seed-medicaments', require('../seeds/seedMedicaments_route'));
router.post('/migrate-buprenorphine', require('../seeds/migrateBuprenorphine'));

/* ── POST /admin/seed-s1-20 ──────────────────────────────────────────────── */
router.post('/seed-s1-20', async (req, res) => {
  try {
    const { seedS1_20 } = require('../seeds/seedS1_20');
    const result = await seedS1_20();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[seed-s1-20]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/seed-new-quizzes ────────────────────────────────────────── */
router.post('/seed-new-quizzes', async (req, res) => {
  try {
    const { seedNewQuizzes } = require('../seeds/seedNewQuizzes');
    const result = await seedNewQuizzes();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[seed-new-quizzes]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
