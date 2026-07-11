const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createMemo, getMyMemos, getSentMemos, getReceivedMemos, getMemoById,
  updateMemo, deleteMemo, approveMemo, rejectMemo, forwardMemo, submitMemo, getPendingMemos
} = require('../controllers/memoController');

router.post('/', authMiddleware, createMemo);
router.get('/', authMiddleware, getMyMemos);
router.get('/sent', authMiddleware, getSentMemos);
router.get('/received', authMiddleware, getReceivedMemos);
router.get('/pending', authMiddleware, getPendingMemos);
router.get('/:id', authMiddleware, getMemoById);
router.put('/:id', authMiddleware, updateMemo);
router.delete('/:id', authMiddleware, deleteMemo);
router.post('/:id/submit', authMiddleware, submitMemo);
router.post('/:id/approve', authMiddleware, approveMemo);
router.post('/:id/reject', authMiddleware, rejectMemo);
router.post('/:id/forward', authMiddleware, forwardMemo);

module.exports = router;
