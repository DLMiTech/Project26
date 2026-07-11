const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMemoHistory } = require('../controllers/memoHistoryController');

router.get('/:memoId', authMiddleware, getMemoHistory);

module.exports = router;
