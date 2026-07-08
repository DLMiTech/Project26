const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/', accessController.requestAccess);

// View all access controls
router.get('/', accessController.getAllAccessPending);
router.get('/all', accessController.getAllAccess);

// grant access
router.put('/:id', accessController.updateAccess);


// Delete access
router.delete('/:id', accessController.deleteAccess);









// Get all lecturers with their courses
router.get('/lecturers', accessController.getAllLecturers);

// Get single lecturer with courses
router.get('/lecturers/:id', accessController.getLecturerById);

// HOD grants access to lecturer
router.post('/grant', accessController.grantAccess);

// View access by ID
router.get('/:id', accessController.getAccessById);

module.exports = router;