const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Full overview (HOD mainly)
router.get('/overview', DashboardController.getOverview);

// Specific stats
router.get('/total-users', DashboardController.getTotalUsers);
router.get('/total-access', DashboardController.getTotalAccess);        // ?status=approve|decline|pending
router.get('/access-by-status', DashboardController.getAccessByStatus);

// Login user info
router.get('/me', DashboardController.getLoginUserInfo);

// Lecture-specific dashboard
router.get('/lecture', DashboardController.getLectureDashboard);

module.exports = router;