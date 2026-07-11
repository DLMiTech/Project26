const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addAttachment, getAttachments, deleteAttachment } = require('../controllers/memoAttachmentController');

// Create uploads folder
const uploadDir = path.join(__dirname, '../uploads/memos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'memo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// KEY: upload.single('file') MUST match frontend FormData key
router.post('/', authMiddleware, upload.single('file'), addAttachment);
router.get('/memo/:memoId', authMiddleware, getAttachments);
router.delete('/:id', authMiddleware, deleteAttachment);

// Error handler
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
});

module.exports = router;