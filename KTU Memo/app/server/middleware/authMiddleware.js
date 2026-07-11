const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get full user details from database
        const [rows] = await pool.execute(
            `SELECT u.id, u.name, u.email, u.role, u.is_verified,
                    d.id as department_id, d.name as department_name
             FROM users u
             LEFT JOIN user_departments ud ON u.id = ud.user_id
             LEFT JOIN departments d ON ud.department_id = d.id
             WHERE u.id = ?`,
            [decoded.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found.' });
        }

        const user = rows[0];

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Account not verified. Please verify your email.' });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department_id: user.department_id,
            department_name: user.department_name
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Required role: ${roles.join(' or ')}` 
            });
        }
        next();
    };
};

module.exports = { authMiddleware, authorize };
