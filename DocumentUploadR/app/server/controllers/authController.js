const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const { sendOTP } = require('../utils/email');
const CourseModel = require("../models/courseModel");
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const authController = {
    // 1. REGISTER - Create account & send OTP
    register: async (req, res) => {
        try {
            const { name, email, password, role="lecturer" } = req.body;

            // Check if email exists
            const existing = await authModel.findByEmail(email);
            if (existing) {
                return res.status(400).json({
                    status: 400,
                    message: 'Email already registered'
                });
            }

            // Create user
            const { id, otp } = await authModel.createUser(name, email, password, role);

            // Send OTP
            await sendOTP(email, otp, 'verification');

            return res.status(201).json({
                status: 201,
                message: 'Registration successful. Check your email for OTP.',
                data: {
                    email,
                    id
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message });
        }
    },

    // 2. VERIFY OTP
    verifyOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await authModel.verifyOTP(email, otp);

            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid or expired OTP'
                });
            }

            // Mark verified
            await authModel.verifyUser(email);

            // Generate token
            const token = generateToken(user);

            return res.status(200).json({
                status: 200,
                message: 'Account verified successfully. Welcome to Dashboard!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    // 3. LOGIN - Step 1: Check credentials & send OTP
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await authModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const validPassword = await authModel.checkPassword(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid email or password'
                });
            }

            // Generate and send OTP
            const otp = await authModel.setOTP(email);
            await sendOTP(email, otp, 'login');

            return res.status(200).json({
                status: 200,
                message: 'OTP sent to your email. Please verify to continue.',
                data: {
                    email,
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    // 4. VERIFY LOGIN OTP
    verifyLoginOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await authModel.verifyOTP(email, otp);
            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid or expired OTP'
                });
            }

            // Clear OTP
            await authModel.verifyUser(email);

            // Generate token
            const token = generateToken(user);

            return res.status(200).json({
                status: 200,
                message: 'Login successful. Welcome to Dashboard!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    verifyForgotPasswordOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await authModel.verifyOTP(email, otp);
            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid or expired OTP'
                });
            }

            // Clear OTP
            await authModel.verifyUser(email);

            return res.status(200).json({
                status: 200,
                message: 'Verification successfully, reset your password',
                data: {
                    id: user.id,
                    email: user.email,
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    // 5. FORGOT PASSWORD - Send OTP
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await authModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Email not found' });
            }

            const otp = await authModel.setOTP(email);
            await sendOTP(email, otp, 'reset');

            return res.status(200).json({
                status: 200,
                message: 'OTP sent to your email for password reset.',
                data: {
                    email
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    // 6. RESET PASSWORD - Verify OTP & set new password
    resetPassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;

            await authModel.updatePassword(email, newPassword);

            return res.status(200).json({
                status: 200,
                message: 'Password reset successful. Please login with your new password.'
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Server error', error: error.message
            });
        }
    },

    // 7. GET DASHBOARD (Protected)
    dashboard: async (req, res) => {
        try {
            const user = await authModel.findByEmail(req.user.email);
            res.json({
                message: 'Welcome to Dashboard!',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            // Client should remove token from storage
            // Server-side: optionally blacklist token (not needed for simple JWT)
            return res.status(200).json({
                status: 200,
                message: 'Logout successful'
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    },

    getLectures: async (req, res) => {
        try {
            const lectures = await authModel.getAllUsers();
            console.log(lectures);

            res.status(200).json({
                success: true,
                count: lectures.length,
                data: lectures
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message
            });
        }
    }
};

module.exports = authController;