import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Middleware to check if user is authorized
const getUserStatus = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return 'unauthorized';

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded && decoded.UserInfo) return 'authorized';
    } catch (err) {
        return 'unauthorized';
    }
    return 'unauthorized';
};

// Rate limiters
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: (req) => {
        const status = getUserStatus(req);
        return status === 'authorized' ? 100 : 20; // 100 for authorized, 20 for unauthorized
    },
    message: (req) => {
        const status = getUserStatus(req);
        return {
            status: 429,
            message: status === 'authorized' ?
                'Too many requests from this authorized user, try again later' :
                'Too many requests from this IP, try again later'
        };
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

export default limiter;