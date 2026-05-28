const router = require('express').Router();
const ctrl = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, ctrl.getAll);
router.get('/admin', protect, adminOnly, ctrl.adminGetAll);
router.get('/personal', protect, ctrl.getPersonal);
router.get('/gen-status', protect, ctrl.genStatus);
router.post('/generate', protect, ctrl.generateQuiz);
router.delete('/personal/:id', protect, ctrl.deletePersonal);
router.get('/:id', protect, ctrl.getOne);
router.get('/:id/progress', protect, ctrl.getProgress);
router.put('/:id/progress', protect, ctrl.saveProgress);
router.post('/:id/attempt', protect, ctrl.submitAttempt);
router.post('/', protect, adminOnly, ctrl.create);
router.put('/:id', protect, adminOnly, ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
