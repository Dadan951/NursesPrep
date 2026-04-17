const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getClasses, createClass, updateClass, deleteClass,
  getDrugs, getDrug, createDrug, updateDrug, deleteDrug,
} = require('../controllers/drugController');

router.use(protect);

/* ── Drug classes ──────────────────────────── */
router.route('/classes')
  .get(getClasses)
  .post(adminOnly, createClass);

router.route('/classes/:id')
  .put(adminOnly, updateClass)
  .delete(adminOnly, deleteClass);

/* ── Drugs ─────────────────────────────────── */
router.route('/')
  .get(getDrugs)
  .post(adminOnly, createDrug);

router.route('/:id')
  .get(getDrug)
  .put(adminOnly, updateDrug)
  .delete(adminOnly, deleteDrug);

module.exports = router;
