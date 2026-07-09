const LectureCourseModel = require('../models/lectureCourseModel');
const CourseModel = require('../models/courseModel');

const LectureCourseController = {
    async add(req, res) {
        try {
            const {user_id, course_id, semester } = req.body;
            //const user_id = req.user.id;

            // Validation
            if (!course_id || !semester) {
                return res.status(400).json({
                    success: false,
                    message: 'course_id and semester are required'
                });
            }

            // Validate semester value
            const validSemesters = ['1st', '2nd'];
            if (!validSemesters.includes(semester)) {
                return res.status(400).json({
                    success: false,
                    message: 'Semester must be either 1st or 2nd'
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

            // Check if already assigned
            const exists = await LectureCourseModel.exists(user_id, course_id, semester);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Course already assigned to this lecture for this semester'
                });
            }

            const lectureCourse = await LectureCourseModel.create({
                user_id,
                course_id,
                semester
            });

            res.status(201).json({
                success: true,
                message: 'Course assigned to lecture successfully',
                data: lectureCourse
            });
        } catch (error) {
            console.error('Error assigning course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const lectureCourses = await LectureCourseModel.getAll();
            res.status(200).json({
                success: true,
                count: lectureCourses.length,
                data: lectureCourses
            });
        } catch (error) {
            console.error('Error fetching lecture courses:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getByLecture(req, res) {
        try {
            const user_id = req.params.user_id || req.user.id;

            // HOD can view any lecture's courses, lectures can only view their own
            if (req.user.role === 'lecture' && parseInt(user_id) !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only view your own assigned courses'
                });
            }

            const lectureCourses = await LectureCourseModel.getByLecture(user_id);
            res.status(200).json({
                success: true,
                count: lectureCourses.length,
                data: lectureCourses
            });
        } catch (error) {
            console.error('Error fetching lecture courses:', error);
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

            // Get the lecture course first to check ownership
            const lectureCourse = await LectureCourseModel.getById(id);
            if (!lectureCourse) {
                return res.status(404).json({
                    success: false,
                    message: 'Lecture course assignment not found'
                });
            }

            // Only HOD or the assigned lecture can delete
            if (req.user.role === 'lecture' && lectureCourse.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete your own course assignments'
                });
            }

            const deleted = await LectureCourseModel.delete(id);
            res.status(200).json({
                success: true,
                message: 'Course assignment deleted successfully',
                data: deleted
            });
        } catch (error) {
            console.error('Error deleting lecture course:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = LectureCourseController;