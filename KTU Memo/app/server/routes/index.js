const express = require('express');
const router = express.Router();

const facultyRoutes = require('./facultyRoutes');
const departmentRoutes = require('./departmentRoutes');
const userDepartmentRoutes = require('./userDepartmentRoutes');
const memoRoutes = require('./memoRoutes');
const memoAttachmentRoutes = require('./memoAttachmentRoutes');
const memoHistoryRoutes = require('./memoHistoryRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount all sub-routes
router.use('/faculties', facultyRoutes);
router.use('/departments', departmentRoutes);
router.use('/user-departments', userDepartmentRoutes);
router.use('/memos', memoRoutes);
router.use('/memo-attachments', memoAttachmentRoutes);
router.use('/memo-history', memoHistoryRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
