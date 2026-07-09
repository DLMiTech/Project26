const express = require('express');
const router = express.Router();
const AccessControlController = require('../controllers/accessControlController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', AccessControlController.add);                                    // Add access request
router.get('/', AccessControlController.getAll);                                  // Get all access controls (with lecture & course info)
router.get('/lecture/:user_id', AccessControlController.getAllByLectureId);       // Get access controls by lecture ID
router.put('/grant/:id', AccessControlController.grantAccess);                    // Grant/decline single access
router.put('/grant-all/:course_id', AccessControlController.grantAccessToAll);    // Grant/decline all pending for a course
router.delete('/:id', AccessControlController.delete);                            // Delete access request

module.exports = router;