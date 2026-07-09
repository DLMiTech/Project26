const CourseModel = require('../models/courseModel');

const CourseController = {
    async add(req, res) {
        try {
            const { code, title, credit_hours, description } = req.body;

            // Validation
            if (!code || !title || !credit_hours) {
                return res.status(400).json({
                    success: false,
                    message: 'Code, title, and credit_hours are required'
                });
            }

            // Check of course code already exists
            const exists = await CourseModel.existsByCode(code);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Course with this code already exists'
                });
            }

            const course = await CourseModel.create({
                code,
                title,
                credit_hours,
                description
            });

            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: course
            });
        } catch (error) {
            console.error('Error creating course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const courses = await CourseModel.getAll();
            res.status(200).json({
                success: true,
                count: courses.length,
                data: courses
            });
        } catch (error) {
            console.error('Error fetching courses:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const course = await CourseModel.getById(id);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.status(200).json({
                success: true,
                data: course
            });
        } catch (error) {
            console.error('Error fetching course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { code, title, credit_hours, description } = req.body;

            // Check if course exists
            const existing = await CourseModel.getById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // If code is being changed, check for duplicates
            if (code && code !== existing.code) {
                const exists = await CourseModel.existsByCode(code);
                if (exists) {
                    return res.status(409).json({
                        success: false,
                        message: 'Course with this code already exists'
                    });
                }
            }

            const course = await CourseModel.update(id, {
                code: code || existing.code,
                title: title || existing.title,
                credit_hours: credit_hours || existing.credit_hours,
                description: description !== undefined ? description : existing.description
            });

            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                data: course
            });
        } catch (error) {
            console.error('Error updating course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;

            const course = await CourseModel.delete(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course deleted successfully',
                data: course
            });
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = CourseController;