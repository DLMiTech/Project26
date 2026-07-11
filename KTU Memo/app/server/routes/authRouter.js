const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/verify-login-otp', authController.verifyLoginOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP);
router.post('/reset-password', authController.resetPassword);

router.post('/logout', authMiddleware, authController.logout);
router.get('/users', authMiddleware, authController.getAllUsers);

// Protected route
// router.get('/dashboard', authMiddleware, authController.dashboard);


module.exports = router;