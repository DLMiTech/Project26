const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Create course
router.post('/', courseController.addCourse);

// Get all courses
router.get('/', courseController.getAllCourses);

// Get my courses
router.get('/my-courses', courseController.getMyCourses);

// Get courses by semester
router.get('/semester/:semester', courseController.getBySemester);

// Get single course
router.get('/:id', courseController.getCourseById);

// Update course
router.put('/:id', courseController.updateCourse);

// Delete course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;