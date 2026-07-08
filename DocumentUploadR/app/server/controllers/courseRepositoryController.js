const CourseRepositoryModel = require('../models/courseRepositoryModel');
const SemesterRepoModel = require('../models/semesterRepoModel');
const CourseModel = require('../models/courseModel');

const CourseRepositoryController = {
    async create(req, res) {
        try {
            const { semester_id, course_id } = req.body;

            // Validation
            if (!semester_id || !course_id) {
                return res.status(400).json({
                    success: false,
                    message: 'semester_id and course_id are required'
                });
            }

            // Check if semester exists
            const semesterExists = await SemesterRepoModel.getById(semester_id);
            if (!semesterExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
            }

            // Check if course exists
            const courseExists = await CourseModel.getById(course_id);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Check if course already linked to this semester
            const exists = await CourseRepositoryModel.exists(semester_id, course_id);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Course already linked to this semester'
                });
            }

            const courseRepo = await CourseRepositoryModel.create({
                semester_id,
                course_id
            });

            res.status(201).json({
                success: true,
                message: 'Course linked to semester successfully',
                data: courseRepo
            });
        } catch (error) {
            console.error('Error creating course repository:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const courseRepos = await CourseRepositoryModel.getAll();
            res.status(200).json({
                success: true,
                count: courseRepos.length,
                data: courseRepos
            });
        } catch (error) {
            console.error('Error fetching course repositories:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getBySemester(req, res) {
        try {
            const { semester_id } = req.params;

            const semesterExists = await SemesterRepoModel.getById(semester_id);
            if (!semesterExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
            }

            const courseRepos = await CourseRepositoryModel.getBySemesterId(semester_id);
            res.status(200).json({
                success: true,
                count: courseRepos.length,
                data: courseRepos
            });
        } catch (error) {
            console.error('Error fetching course repositories by semester:', error);
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

            const courseRepo = await CourseRepositoryModel.delete(id);
            if (!courseRepo) {
                return res.status(404).json({
                    success: false,
                    message: 'Course repository link not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Course repository link deleted successfully',
                data: courseRepo
            });
        } catch (error) {
            console.error('Error deleting course repository:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = CourseRepositoryController;