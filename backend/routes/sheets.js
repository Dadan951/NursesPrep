const router = require('express').Router();
const multer = require('multer');
const ctrl   = require('../controllers/sheetController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.use(protect);

router.get('/',           ctrl.getSheets);
router.get('/gen-status', ctrl.genStatus);
router.post('/generate',  upload.single('file'), ctrl.generate);
router.get('/:id',        ctrl.getSheet);
router.delete('/:id',     ctrl.deleteSheet);

module.exports = router;
