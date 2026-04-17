const router = require('express').Router();
const multer = require('multer');
const ctrl   = require('../controllers/lessonController');
const { protect, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

// Public file download (no auth — published content)
router.get('/:id/file', ctrl.downloadFile);

// Admin-only list (before /:id)
router.get('/admin', protect, adminOnly, ctrl.adminGetAll);

// Student routes
router.get('/',     protect, ctrl.getAll);
router.get('/:id',  protect, ctrl.getOne);

// Admin CRUD (multipart for file upload)
router.post('/',    protect, adminOnly, upload.single('file'), ctrl.create);
router.put('/:id',  protect, adminOnly, upload.single('file'), ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
