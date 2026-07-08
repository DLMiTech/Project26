const express = require('express');
const router = express.Router();
const RepositoryController = require('../controllers/repositoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', RepositoryController.create);     // Create repository
router.get('/', RepositoryController.getAll);       // Get all repositories
router.delete('/:id', RepositoryController.delete); // Delete repository

module.exports = router;