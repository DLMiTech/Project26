const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get all lecturers with their courses
router.get('/lecturers', accessController.getAllLecturers);

// Get single lecturer with courses
router.get('/lecturers/:id', accessController.getLecturerById);

// HOD grants access to lecturer
router.post('/grant', accessController.grantAccess);

// View all access controls
router.get('/', accessController.getAllAccess);

// View access by ID
router.get('/:id', accessController.getAccessById);

// Update access
router.put('/:id', accessController.updateAccess);

// Delete access
router.delete('/:id', accessController.deleteAccess);

module.exports = router;