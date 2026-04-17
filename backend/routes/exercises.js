const router = require('express').Router();
const ctrl = require('../controllers/exerciseController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, ctrl.getAll);
router.get('/admin', protect, adminOnly, ctrl.adminGetAll);
router.get('/:id', protect, ctrl.getOne);
router.post('/complete', protect, ctrl.complete);
router.post('/', protect, adminOnly, ctrl.create);
router.put('/:id', protect, adminOnly, ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
