const DashboardModel = require('../models/dashboardModel');

const DashboardController = {
    // ===== OVERVIEW DASHBOARD (HOD) =====
    async getOverview(req, res) {
        try {
            const [
                totalUsers,
                usersByRole,
                newUsersThisMonth,
                totalAccessByStatus,
                accessByLevel,
                pendingRequests,
                totalCourses,
                coursesByCreditHours,
                totalLectureCourses,
                lectureCoursesBySemester,
                totalRepositories,
                latestRepository,
                totalUploads,
                uploadsThisMonth,
                uploadsByCourse,
                recentActivity
            ] = await Promise.all([
                DashboardModel.getTotalUsers(),
                DashboardModel.getUsersByRole(),
                DashboardModel.getNewUsersThisMonth(),
                DashboardModel.getAccessByStatus(),
                DashboardModel.getAccessByLevel(),
                DashboardModel.getPendingAccessRequests(),
                DashboardModel.getTotalCourses(),
                DashboardModel.getCoursesByCreditHours(),
                DashboardModel.getTotalLectureCourses(),
                DashboardModel.getLectureCoursesBySemester(),
                DashboardModel.getTotalRepositories(),
                DashboardModel.getLatestRepository(),
                DashboardModel.getTotalUploads(),
                DashboardModel.getUploadsThisMonth(),
                DashboardModel.getUploadsByCourse(),
                DashboardModel.getRecentActivity(15)
            ]);

            res.status(200).json({
                success: true,
                data: {
                    users: {
                        total: totalUsers,
                        by_role: usersByRole,
                        new_this_month: newUsersThisMonth
                    },
                    access_control: {
                        by_status: totalAccessByStatus,
                        by_level: accessByLevel,
                        pending_requests: pendingRequests
                    },
                    courses: {
                        total: totalCourses,
                        by_credit_hours: coursesByCreditHours,
                        total_assignments: totalLectureCourses,
                        by_semester: lectureCoursesBySemester
                    },
                    repositories: {
                        total: totalRepositories,
                        latest: latestRepository
                    },
                    uploads: {
                        total: totalUploads,
                        this_month: uploadsThisMonth,
                        by_course: uploadsByCourse
                    },
                    recent_activity: recentActivity
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // ===== SPECIFIC STATS =====
    async getTotalUsers(req, res) {
        try {
            const total = await DashboardModel.getTotalUsers();
            res.status(200).json({ success: true, data: { total_users: total } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getTotalAccess(req, res) {
        try {
            const { status } = req.query;
            const total = await DashboardModel.getTotalAccess(status || null);
            res.status(200).json({
                success: true,
                data: {
                    status: status || 'all',
                    total_access: total
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getAccessByStatus(req, res) {
        try {
            const stats = await DashboardModel.getAccessByStatus();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // ===== LOGIN USER INFO =====
    async getLoginUserInfo(req, res) {
        try {
            const user_id = req.user.id;

            const [userInfo, accessStats, uploadCount] = await Promise.all([
                DashboardModel.getLoginUserInfo(user_id),
                DashboardModel.getUserAccessStats(user_id),
                DashboardModel.getUserUploadCount(user_id)
            ]);

            if (!userInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: userInfo.id,
                        name: userInfo.name,
                        email: userInfo.email,
                        role: userInfo.role,
                        is_verified: userInfo.is_verified,
                        member_since: userInfo.created_at
                    },
                    stats: {
                        access_requests: accessStats,
                        total_uploads: uploadCount
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching login user info:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // ===== LECTURE DASHBOARD =====
    async getLectureDashboard(req, res) {
        try {
            const user_id = req.user.id;

            const [accessStats, uploadCount, recentActivity] = await Promise.all([
                DashboardModel.getUserAccessStats(user_id),
                DashboardModel.getUserUploadCount(user_id),
                DashboardModel.getRecentActivity(5)
            ]);

            res.status(200).json({
                success: true,
                data: {
                    my_access: accessStats,
                    my_uploads: uploadCount,
                    recent_activity: recentActivity
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = DashboardController;