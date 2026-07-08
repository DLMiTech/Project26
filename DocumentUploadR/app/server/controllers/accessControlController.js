const AccessControlModel = require('../models/accessControlModel');
const CourseModel = require('../models/courseModel');
const { sendAccessGrantedEmail, sendAccessDeclinedEmail } = require('../utils/email');

const AccessControlController = {
    async add(req, res) {
        try {
            const { course_id, access_level, start_datetime, end_datetime, note } = req.body;
            const user_id = req.user.id;

            if (!course_id || !access_level) {
                return res.status(400).json({
                    success: false,
                    message: 'course_id and access_level are required'
                });
            }

            const validLevels = ['view', 'download', 'modify'];
            if (!validLevels.includes(access_level)) {
                return res.status(400).json({
                    success: false,
                    message: 'access_level must be view, download, or modify'
                });
            }

            const courseExists = await CourseModel.getById(course_id);
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            const access = await AccessControlModel.create({
                user_id,
                course_id,
                access_level,
                start_datetime,
                end_datetime,
                note
            });

            res.status(201).json({
                success: true,
                message: 'Access request submitted successfully',
                data: access
            });
        } catch (error) {
            console.error('Error creating access request:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const accessList = await AccessControlModel.getAll();
            res.status(200).json({
                success: true,
                count: accessList.length,
                data: accessList
            });
        } catch (error) {
            console.error('Error fetching access controls:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getAllByLectureId(req, res) {
        try {
            const user_id = req.params.user_id || req.user.id;

            if (req.user.role === 'lecture' && parseInt(user_id) !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only view your own access requests'
                });
            }

            const accessList = await AccessControlModel.getAllByLectureId(user_id);
            res.status(200).json({
                success: true,
                count: accessList.length,
                data: accessList
            });
        } catch (error) {
            console.error('Error fetching access controls:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async grantAccess(req, res) {
        try {
            const { id } = req.params;
            const { start_datetime, end_datetime, status } = req.body;


            if (status === 'approve') {
                if (!start_datetime || !end_datetime || !status) {
                    return res.status(400).json({
                        success: false,
                        message: 'start_datetime, end_datetime, and status are required'
                    });
                }
            } else if (status === 'decline') {
                if (!status) {
                    return res.status(400).json({
                        success: false,
                        message: 'status is required'
                    });
                }
            }

            const validStatuses = ['approve', 'decline', 'pending'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'status must be approve, decline, or pending'
                });
            }

            const access = await AccessControlModel.getById(id);
            if (!access) {
                return res.status(404).json({
                    success: false,
                    message: 'Access request not found'
                });
            }


            let updated;

            // Send email notification
            if (status === 'approve') {
                updated = await AccessControlModel.grantAccess(id, {
                    start_datetime,
                    end_datetime,
                    status
                });
                await sendAccessGrantedEmail(
                    access.lecture_email,
                    access.lecture_name,
                    access.course_title,
                    access.access_level,
                    start_datetime,
                    end_datetime
                );
            } else if (status === 'decline') {
                updated = await AccessControlModel.declineAccess(id, {
                    status
                });
                await sendAccessDeclinedEmail(
                    access.lecture_email,
                    access.lecture_name,
                    access.course_title
                );
            }

            res.status(200).json({
                success: true,
                message: `Access ${status}d successfully`,
                data: updated
            });
        } catch (error) {
            console.error('Error granting access:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async grantAccessToAll(req, res) {
        try {
            const { course_id } = req.params;
            const { start_datetime, end_datetime, status } = req.body;

            if (!start_datetime || !end_datetime || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'start_datetime, end_datetime, and status are required'
                });
            }

            const validStatuses = ['approve', 'decline'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'status must be approve or decline'
                });
            }

            // Get all pending requests for this course with user emails
            const pendingRequests = await AccessControlModel.getPendingByCourse(course_id);

            // Update all pending requests for this course
            const updated = await AccessControlModel.grantAccessToAll(course_id, {
                start_datetime,
                end_datetime,
                status
            });

            // Send emails to all affected users
            const emailPromises = pendingRequests.map(async (req) => {
                try {
                    if (status === 'approve') {
                        await sendAccessGrantedEmail(
                            req.email,
                            req.name,
                            req.course_title || 'Course',
                            req.access_level,
                            start_datetime,
                            end_datetime
                        );
                    } else if (status === 'decline') {
                        await sendAccessDeclinedEmail(
                            req.email,
                            req.name,
                            req.course_title || 'Course'
                        );
                    }
                } catch (emailErr) {
                    console.error(`Failed to send email to ${req.email}:`, emailErr);
                }
            });

            await Promise.all(emailPromises);

            res.status(200).json({
                success: true,
                message: `Access ${status}d for ${updated.length} request(s)`,
                data: updated
            });
        } catch (error) {
            console.error('Error granting access to all:', error);
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

            const access = await AccessControlModel.delete(id);
            if (!access) {
                return res.status(404).json({
                    success: false,
                    message: 'Access request not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Access request deleted successfully',
                data: access
            });
        } catch (error) {
            console.error('Error deleting access request:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = AccessControlController;