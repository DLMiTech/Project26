const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addAttachment, getAttachments, deleteAttachment } = require('../controllers/memoAttachmentController');

router.post('/', authMiddleware, addAttachment);
router.get('/memo/:memoId', authMiddleware, getAttachments);
router.delete('/:id', authMiddleware, deleteAttachment);

module.exports = router;
