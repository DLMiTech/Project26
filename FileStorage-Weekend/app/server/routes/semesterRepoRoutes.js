const express = require('express');
const router = express.Router();
const SemesterRepoController = require('../controllers/semesterRepoController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', SemesterRepoController.create);                          // Create semester
router.get('/', SemesterRepoController.getAll);                           // Get all semesters (with repository year)
router.get('/repository/:repository_id', SemesterRepoController.getByRepository); // Get semesters by repository ID
router.delete('/:id', SemesterRepoController.delete);                     // Delete semester

module.exports = router;