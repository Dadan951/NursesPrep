const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
});

router.use(protect);

router.get('/', ctrl.getFiles);
router.post('/upload', upload.single('file'), ctrl.upload);
router.get('/:id/download', ctrl.download);
router.delete('/:id', ctrl.deleteFile);

module.exports = router;
