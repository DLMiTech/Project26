const { pool } = require('../config/db');

const DashboardModel = {
    async getTotalUsers() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users');
        return rows[0].total;
    },

    async getUsersByRole() {
        const [rows] = await pool.execute(`
            SELECT role, COUNT(*) as count 
            FROM users 
            WHERE is_verified = true 
            GROUP BY role
        `);
        return rows;
    },

    async getNewUsersThisMonth() {
        const [rows] = await pool.execute(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        `);
        return rows[0].count;
    },

    async getTotalAccess(status = null) {
        let query = 'SELECT COUNT(*) as total FROM access_control';
        const params = [];
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        const [rows] = await pool.execute(query, params);
        return rows[0].total;
    },

    async getAccessByStatus() {
        const [rows] = await pool.execute(`
            SELECT status, COUNT(*) as count 
            FROM access_control 
            GROUP BY status
        `);
        return rows;
    },

    async getAccessByLevel() {
        const [rows] = await pool.execute(`
            SELECT access_level, COUNT(*) as count 
            FROM access_control 
            WHERE status = 'approve'
            GROUP BY access_level
        `);
        return rows;
    },

    async getPendingAccessRequests() {
        const [rows] = await pool.execute(`
            SELECT ac.*, u.name, u.email, c.title as course_title
            FROM access_control ac
            JOIN users u ON ac.user_id = u.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.status = 'pending'
            ORDER BY ac.created_at DESC
            LIMIT 10
        `);
        return rows;
    },

    async getTotalCourses() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM courses');
        return rows[0].total;
    },

    async getCoursesByCreditHours() {
        const [rows] = await pool.execute(`
            SELECT credit_hours, COUNT(*) as count 
            FROM courses 
            GROUP BY credit_hours 
            ORDER BY credit_hours
        `);
        return rows;
    },

    async getTotalLectureCourses() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM lecture_courses');
        return rows[0].total;
    },

    async getLectureCoursesBySemester() {
        const [rows] = await pool.execute(`
            SELECT semester, COUNT(*) as count 
            FROM lecture_courses 
            GROUP BY semester
        `);
        return rows;
    },

    async getTotalRepositories() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM repository');
        return rows[0].total;
    },

    async getLatestRepository() {
        const [rows] = await pool.execute(`
            SELECT * FROM repository 
            ORDER BY year DESC 
            LIMIT 1
        `);
        return rows[0] || null;
    },

    async getTotalUploads() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM uploads');
        return rows[0].total;
    },

    async getUploadsThisMonth() {
        const [rows] = await pool.execute(`
            SELECT COUNT(*) as count 
            FROM uploads 
            WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        `);
        return rows[0].count;
    },

    async getUploadsByCourse() {
        const [rows] = await pool.execute(`
            SELECT c.title as course_title, COUNT(u.id) as upload_count
            FROM courses c
            LEFT JOIN course_repository cr ON c.id = cr.course_id
            LEFT JOIN uploads u ON cr.id = u.course_repository_id
            GROUP BY c.id, c.title
            ORDER BY upload_count DESC
            LIMIT 10
        `);
        return rows;
    },

    async getRecentActivity(limit = 10) {
        // Use query() instead of execute() because MySQL prepared statements
        // don't handle LIMIT ? well with UNION subqueries
        const [rows] = await pool.query(`
            SELECT * FROM (
                              SELECT 'upload' as type, u.id, u.file_path, u.created_at, lect.name as user_name, c.title as course_title
                              FROM uploads u
                                       JOIN users lect ON u.lecture_id = lect.id
                                       JOIN course_repository cr ON u.course_repository_id = cr.id
                                       JOIN courses c ON cr.course_id = c.id
                              UNION ALL
                              SELECT 'access_request' as type, ac.id, ac.access_level as file_path, ac.created_at, req.name as user_name, c.title as course_title
                              FROM access_control ac
                                       JOIN users req ON ac.user_id = req.id
                                       JOIN courses c ON ac.course_id = c.id
                          ) AS combined
            ORDER BY created_at DESC
                LIMIT ${parseInt(limit)}
        `);
        return rows;
    },

    async getLoginUserInfo(user_id) {
        const [rows] = await pool.execute(`
            SELECT id, name, email, role, is_verified, created_at
            FROM users
            WHERE id = ?
        `, [user_id]);
        return rows[0] || null;
    },

    async getUserAccessStats(user_id) {
        const [rows] = await pool.execute(`
            SELECT 
                SUM(CASE WHEN status = 'approve' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'decline' THEN 1 ELSE 0 END) as declined,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                COUNT(*) as total
            FROM access_control
            WHERE user_id = ?
        `, [user_id]);
        return rows[0];
    },

    async getUserUploadCount(user_id) {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM uploads WHERE lecture_id = ?', [user_id]);
        return rows[0].count;
    }
};

module.exports = DashboardModel;