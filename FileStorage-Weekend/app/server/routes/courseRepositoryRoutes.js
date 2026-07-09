const express = require('express');
const router = express.Router();
const CourseRepositoryController = require('../controllers/courseRepositoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', CourseRepositoryController.create);                          // Link course to semester
router.get('/', CourseRepositoryController.getAll);                           // Get all course repositories (with year, semester, course info)
router.get('/semester/:semester_id', CourseRepositoryController.getBySemester); // Get by semester ID
router.delete('/:id', CourseRepositoryController.delete);                    // Delete course repository link

module.exports = router;