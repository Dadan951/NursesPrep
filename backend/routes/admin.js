const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { adminGetGroups, adminDeleteGroup } = require('../controllers/groupController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

router.get('/groups', adminGetGroups);
router.delete('/groups/:id', adminDeleteGroup);

// ── Seeds Semestre 1 (usage unique, puis peut être retiré) ────────────────
router.post('/seed-s1', require('../seeds/seedSemestre1_route'));
router.post('/seed-flashcards-s1', require('../seeds/seedFlashcardsSemestre1_route'));

module.exports = router;
