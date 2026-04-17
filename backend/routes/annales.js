const router = require('express').Router();
const multer = require('multer');
const ctrl   = require('../controllers/annaleController');
const { protect, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB (annales can be large PDFs)
});

// Public file download
router.get('/:id/file', ctrl.downloadFile);

// Admin-only list
router.get('/admin', protect, adminOnly, ctrl.adminGetAll);

// Student routes
router.get('/',    protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getOne);

// Admin CRUD
router.post('/',    protect, adminOnly, upload.single('file'), ctrl.create);
router.put('/:id',  protect, adminOnly, upload.single('file'), ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
