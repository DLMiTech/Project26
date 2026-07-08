const express = require('express');
const router = express.Router();
const LectureCourseController = require('../controllers/lectureCourseController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', LectureCourseController.add);                          // Add course to lecture
router.get('/', LectureCourseController.getAll);                        // Get all lecture courses (with lecture & course info)
router.get('/my-courses', LectureCourseController.getByLecture);        // Get current lecture's courses
router.get('/lecture/:user_id', LectureCourseController.getByLecture);  // Get courses by lecture ID
router.delete('/:id', LectureCourseController.delete);                  // Delete lecture course assignment

module.exports = router;