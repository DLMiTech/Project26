const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./config/db');
const authRouter = require('./routes/authRouter');
const courseRouter = require('./routes/courseRoutes');
const lectureCourseRoutes = require('./routes/lectureCourseRoutes');
const accessControlRoutes = require('./routes/accessControlRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const semesterRepoRoutes = require('./routes/semesterRepoRoutes');
const courseRepositoryRoutes = require('./routes/courseRepositoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lecture-courses', lectureCourseRoutes);
app.use('/api/access-control', accessControlRoutes);
app.use('/api/repository', repositoryRoutes);
app.use('/api/semester-repo', semesterRepoRoutes);
app.use('/api/course-repository', courseRepositoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

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