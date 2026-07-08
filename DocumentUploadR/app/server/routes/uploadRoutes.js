const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', upload.single('file'), UploadController.create);                    // Create upload
router.get('/course/:course_repository_id', UploadController.getAllCourseUpload);  // Get all uploads for a course
router.put('/:id', UploadController.update);                                         // Update upload
router.delete('/:id', UploadController.delete);                                    // Delete upload
router.get('/download/:id', UploadController.downloadOneUpload);                     // Download single file
router.get('/download-all/:course_repository_id', UploadController.downloadAllInOne); // Download all as stream
router.get('/download-zip/:course_repository_id', UploadController.downloadAllAsZip);   // Download all as zip
router.post('/zip/:course_repository_id', UploadController.zipAllCourseUpload);         // Create zip file on server

module.exports = router;