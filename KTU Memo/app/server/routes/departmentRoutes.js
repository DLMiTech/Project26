const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createDepartment, getAllDepartments, getDepartmentById,
  getDepartmentsByFaculty, updateDepartment, deleteDepartment
} = require('../controllers/departmentController');

router.get('/', authMiddleware, getAllDepartments);
router.get('/:id', authMiddleware, getDepartmentById);
router.get('/faculty/:facultyId', authMiddleware, getDepartmentsByFaculty);
router.post('/', authMiddleware, roleMiddleware(['admin', 'dean']), createDepartment);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'dean']), updateDepartment);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteDepartment);

module.exports = router;
