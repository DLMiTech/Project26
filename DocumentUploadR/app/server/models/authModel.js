const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const getOTPExpiry = () => new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

const authModel = {
    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    },

    // Create new user
    createUser: async (name, email, password, role) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, otp, otpExpires]
        );

        return { id: result.insertId, otp };
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expires_at > NOW()',
            [email, otp]
        );
        return rows[0] || null;
    },

    // Mark user as verified
    verifyUser: async (email) => {
        await pool.query(
            'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE email = ?',
            [email]
        );
    },

    // Set new OTP (for login or reset)
    setOTP: async (email) => {
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();
        await pool.query(
            'UPDATE users SET otp = ?, otp_expires_at = ? WHERE email = ?',
            [otp, otpExpires, email]
        );
        return otp;
    },

    // Update password
    updatePassword: async (email, newPassword) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = ?, otp = NULL, otp_expires_at = NULL WHERE email = ?',
            [hashedPassword, email]
        );
    },

    // Check password
    checkPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

module.exports = authModel;