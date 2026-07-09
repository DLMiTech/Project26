const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', CourseController.add);           // Add course
router.get('/', CourseController.getAll);          // Get all courses
router.get('/:id', CourseController.getById);      // Get course by ID
router.put('/:id', CourseController.update);       // Update course
router.delete('/:id', CourseController.delete);    // Delete course

module.exports = router;