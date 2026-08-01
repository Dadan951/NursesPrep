const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/in-progress', protect, ctrl.getInProgress);

module.exports = router;
