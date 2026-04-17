const router = require('express').Router();
const ctrl   = require('../controllers/ticketController');
const { protect, adminOnly } = require('../middleware/auth');

/* ── User routes ───────────────────────────────────────────────────────────── */
router.post('/',              protect, ctrl.createTicket);
router.get('/my',             protect, ctrl.getMyTickets);
router.get('/my/:id',         protect, ctrl.getMyTicket);
router.post('/my/:id/reply',  protect, ctrl.replyToTicket);

/* ── Admin routes ──────────────────────────────────────────────────────────── */
router.get('/admin',               protect, adminOnly, ctrl.adminGetAll);
router.get('/admin/:id',           protect, adminOnly, ctrl.adminGetOne);
router.post('/admin/:id/reply',    protect, adminOnly, ctrl.adminReply);
router.put('/admin/:id/status',    protect, adminOnly, ctrl.adminUpdateStatus);
router.delete('/admin/:id',        protect, adminOnly, ctrl.adminDelete);

module.exports = router;
