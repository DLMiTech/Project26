const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  joinDepartment, leaveDepartment, getUserDepartments, getDepartmentUsers
} = require('../controllers/userDepartmentController');

router.post('/join', authMiddleware, roleMiddleware(['admin']), joinDepartment);
router.post('/leave', authMiddleware, roleMiddleware(['admin']), leaveDepartment);
router.get('/user/:userId', authMiddleware, getUserDepartments);
router.get('/department/:departmentId', authMiddleware, getDepartmentUsers);

module.exports = router;
