const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createFaculty, getAllFaculties, getFacultyById, updateFaculty, deleteFaculty
} = require('../controllers/facultyController');

router.get('/', authMiddleware, getAllFaculties);
router.get('/:id', authMiddleware, getFacultyById);
router.post('/', authMiddleware, roleMiddleware(['admin']), createFaculty);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateFaculty);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteFaculty);

module.exports = router;
