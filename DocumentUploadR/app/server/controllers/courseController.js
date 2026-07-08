const courseModel = require('../models/courseModel');

const courseController = {
    // Add new course
    addCourse: async (req, res) => {
        try {
            const { code, title, description, semester, credit_hours } = req.body;
            const lecturerId = req.user.id; // From JWT token

            // Validate
            if (!code || !title || !semester) {
                return res.status(400).json({
                    status: 400,
                    message: 'Code, title and semester are required' });
            }

            // Check if code exists
            const exists = await courseModel.codeExists(code);
            if (exists) {
                return res.status(400).json({
                    status: 400,
                    message: 'Course code already exists' });
            }

            // Validate semester
            const validSemesters = ['1st', '2nd'];
            if (!validSemesters.includes(semester)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid semester' });
            }

            const courseId = await courseModel.create(
                code,
                title,
                description || null,
                semester,
                credit_hours || 3,
                lecturerId
            );

            res.status(201).json({
                status: 201,
                message: 'Course created successfully',
                courseId
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message });
        }
    },

    // Get all courses
    getAllCourses: async (req, res) => {
        try {
            const role = req.user.role;
            const lecturerId = req.user.id;
            let courses = [];

            if (role === "hod"){
                courses = await courseModel.getAll();
            }else {
                courses = await courseModel.getAllLecture(lecturerId);
            }

            res.status(200).json({
                status: 200,
                count: courses.length,
                data: courses
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message });
        }
    },

    // Get course by ID
    getCourseById: async (req, res) => {
        try {
            const { id } = req.params;
            const course = await courseModel.getById(id);

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.json({ course });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get my courses (for logged in lecturer)
    getMyCourses: async (req, res) => {
        try {
            const lecturerId = req.user.id;
            const courses = await courseModel.getByLecturer(lecturerId);
            res.json({
                count: courses.length,
                courses
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Get courses by semester
    getBySemester: async (req, res) => {
        try {
            const { semester } = req.params;
            const courses = await courseModel.getBySemester(semester);
            res.json({
                count: courses.length,
                courses
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Update course
    updateCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const lecturerId = req.user.id;
            const { code, title, description, semester, credit_hours } = req.body;

            // Check if course exists
            const course = await courseModel.getById(id);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check ownership (only creator can update)
            if (course.lecturer_id !== lecturerId && req.user.role !== 'hod') {
                return res.status(403).json({ message: 'Not authorized to update this course' });
            }

            // Build updates
            const updates = {};
            if (title) updates.title = title;
            if (description !== undefined) updates.description = description;
            if (semester) updates.semester = semester;
            if (credit_hours) updates.credit_hours = credit_hours;

            // If changing code, check uniqueness
            if (code && code !== course.code) {
                const exists = await courseModel.codeExists(code);
                if (exists) {
                    return res.status(400).json({ message: 'Course code already exists' });
                }
                updates.code = code;
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            await courseModel.update(id, updates);
            res.json({ message: 'Course updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    // Delete course
    deleteCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const lecturerId = req.user.id;

            // Check if course exists
            const course = await courseModel.getById(id);
            if (!course) {
                return res.status(404).json({
                    status: 404,
                    message: 'Course not found' });
            }

            // Check ownership (only creator or HOD can delete)
            if (course.lecturer_id !== lecturerId && req.user.role !== 'hod') {
                return res.status(403).json({
                    status: 403,
                    message: 'Not authorized to delete this course' });
            }

            await courseModel.delete(id);
            return res.status(200).json({
                status: 200,
                message: 'Course deleted successfully' });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Server error', error: error.message });
        }
    }
};

module.exports = courseController;