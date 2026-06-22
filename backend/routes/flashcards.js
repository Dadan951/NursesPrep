const router = require('express').Router();
const ctrl = require('../controllers/flashcardController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',                        protect,             ctrl.getAll);
router.get('/admin',                   protect, adminOnly,  ctrl.adminGetAll);
router.get('/quota',                   protect,             ctrl.getQuota);
router.get('/attempts',                protect,             ctrl.getAttempts);
router.get('/attempt',                 protect,             ctrl.getAttempt);
router.put('/attempt',                 protect,             ctrl.saveAttempt);
router.post('/attempt/complete',       protect,             ctrl.completeAttempt);
router.post('/reviewed',               protect,             ctrl.markReviewed);
router.get('/:id',                     protect,             ctrl.getOne);
router.post('/',                       protect, adminOnly,  ctrl.create);
router.put('/:id',                     protect, adminOnly,  ctrl.update);
router.delete('/:id',                  protect, adminOnly,  ctrl.remove);

module.exports = router;
