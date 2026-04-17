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

module.exports = router;
