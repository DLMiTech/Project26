const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initDB } = require('./config/db');
const authRouter = require('./routes/authRouter');
const courseRouter = require('./routes/courseRouter');
const accessRouter = require('./routes/accessRouter');
require('dotenv').config();

const app = express();

// CORS - Allow your frontend origin
app.use(cors({
    origin: 'http://localhost:5173',  // Your Vite frontend URL
    credentials: true,                // Allow cookies if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/access', accessRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Auth API is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Start server after DB init
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});