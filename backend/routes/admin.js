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

/* ── POST /admin/fix-chapter-names ───────────────────────────────────────── */
router.post('/fix-chapter-names', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const files = [
      ...require('../seeds/quiz20_S1_UE1_1_B'),
      ...require('../seeds/quiz20_S1_UE1_1_C'),
      ...require('../seeds/quiz20_S1_UE2_10_C'),
      ...require('../seeds/quiz20_S1_UE2_10_D'),
      ...require('../seeds/quiz20_S1_UE2_11_C'),
      ...require('../seeds/quiz20_S1_UE2_11_D'),
      ...require('../seeds/quiz20_S1_UE4_1_B'),
      ...require('../seeds/quiz20_S1_UE6_1_B'),
      ...require('../seeds/quiz20_S1_UE6_1_C'),
    ];
    let updated = 0;
    for (const quiz of files) {
      const result = await Quiz.updateOne(
        { title: quiz.title, category: quiz.category },
        { $set: { chapter: quiz.chapter } }
      );
      if (result.modifiedCount > 0) updated++;
    }
    res.json({ success: true, updated, total: files.length });
  } catch (err) {
    console.error('[fix-chapter-names]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/restructure-ue1-1 ───────────────────────────────────────── */
router.post('/restructure-ue1-1', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const mapping = [
      // Fondements de la psychologie
      { from: 'Introduction à la psychologie — définitions, méthodes et courants théoriques', to: 'Fondements de la psychologie' },
      { from: 'Introduction à la psychologie et mécanismes de défense',                       to: 'Fondements de la psychologie' },
      { from: 'Mécanismes de défense — types, rôles et repérage clinique',                    to: 'Fondements de la psychologie' },
      { from: 'Psychanalyse de Freud — inconscient, pulsions et structure psychique',         to: 'Fondements de la psychologie' },
      { from: 'Conditionnement classique et opérant — Pavlov, Watson, Skinner',               to: 'Fondements de la psychologie' },
      { from: 'Stress, coping et résilience — définitions et mécanismes',                     to: 'Fondements de la psychologie' },
      // Développement psychologique
      { from: 'Piaget — stades du développement cognitif de 0 à l\'adolescence',              to: 'Développement psychologique' },
      { from: 'Erikson — stades psychosociaux du nourrisson à la vieillesse',                 to: 'Développement psychologique' },
      { from: 'Psychologie du développement — stades de Piaget et Erikson',                   to: 'Développement psychologique' },
      { from: 'Bowlby — théorie de l\'attachement et implications cliniques',                  to: 'Développement psychologique' },
      { from: 'Psychologie du sujet âgé — vieillissement normal et psychopathologique',       to: 'Développement psychologique' },
      // Relation, besoins et communication
      { from: 'Maslow — hiérarchie des besoins et applications en soins',                     to: 'Relation, besoins et communication' },
      { from: 'Carl Rogers — relation d\'aide, empathie et congruence',                        to: 'Relation, besoins et communication' },
      { from: 'Communication et relations interpersonnelles en soins',                         to: 'Relation, besoins et communication' },
      { from: 'La famille comme système — approche systémique',                                to: 'Relation, besoins et communication' },
      { from: 'Deuil — étapes de Kübler-Ross, deuil pathologique et accompagnement',          to: 'Relation, besoins et communication' },
      // Sociologie et anthropologie de la santé
      { from: 'Sociologie générale — groupe social, norme et déviance',                       to: 'Sociologie et anthropologie de la santé' },
      { from: 'Sociologie des soins et anthropologie de la santé',                             to: 'Sociologie et anthropologie de la santé' },
      { from: 'Déterminants sociaux de santé — inégalités et facteurs socio-économiques',     to: 'Sociologie et anthropologie de la santé' },
      { from: 'Anthropologie médicale — maladie, culture et représentations du corps',        to: 'Sociologie et anthropologie de la santé' },
      { from: 'Représentations sociales de la maladie et du soin',                            to: 'Sociologie et anthropologie de la santé' },
      // Identité professionnelle et soignant
      { from: 'Identité professionnelle infirmière — construction et enjeux',                 to: 'Identité professionnelle et soignant' },
      { from: 'Burnout soignant — signes, facteurs de risque et prévention',                  to: 'Identité professionnelle et soignant' },
    ];
    let total = 0;
    for (const { from, to } of mapping) {
      const r = await Quiz.updateMany(
        { category: 'UE 1.1 - Psychologie, sociologie, anthropologie', chapter: from },
        { $set: { chapter: to } }
      );
      total += r.modifiedCount;
    }
    res.json({ success: true, updated: total });
  } catch (err) {
    console.error('[restructure-ue1-1]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/merge-ue-categories ─────────────────────────────────────── */
router.post('/merge-ue-categories', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const renames = [
      { from: 'UE 2.10 - Infectiologie, hygiène',         to: 'UE 2.10 - Infectiologie et hygiène' },
      { from: 'UE 4.1 - Soins de confort et de relation', to: 'UE 4.1 - Soins de confort et de bien-être' },
      { from: 'UE 6.2 - Anglais médical',                 to: 'UE 6.2 - Anglais' },
    ];
    const results = [];
    for (const { from, to } of renames) {
      const r = await Quiz.updateMany({ category: from }, { $set: { category: to } });
      results.push({ from, to, updated: r.modifiedCount });
    }
    console.log('[merge-ue-categories]', results);
    res.json({ success: true, results });
  } catch (err) {
    console.error('[merge-ue-categories]', err.message);
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
