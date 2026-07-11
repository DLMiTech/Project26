const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMyNotifications, getMemoNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', authMiddleware, getMyNotifications);
router.get('/memo/:memoId', authMiddleware, getMemoNotifications);
router.put('/:id/read', authMiddleware, markAsRead);

module.exports = router;
