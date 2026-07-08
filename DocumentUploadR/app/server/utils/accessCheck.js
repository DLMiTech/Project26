const { pool } = require('../config/db');

const AccessCheck = {
    async hasAccess(user_id, course_id, required_level = 'view') {
        const levelPriority = { view: 1, download: 2, modify: 3 };
        const requiredPriority = levelPriority[required_level] || 1;

        const [rows] = await pool.execute(
            `SELECT access_level, start_datetime, end_datetime, status
             FROM access_control
             WHERE user_id = ? AND course_id = ? AND status = 'approve'`,
            [user_id, course_id]
        );

        if (rows.length === 0) return false;

        const now = new Date();
        for (const access of rows) {
            const start = new Date(access.start_datetime);
            const end = new Date(access.end_datetime);

            if (now >= start && now <= end) {
                const userPriority = levelPriority[access.access_level] || 1;
                if (userPriority >= requiredPriority) {
                    return true;
                }
            }
        }
        return false;
    },

    async isHODOrOwner(user_id, role, upload_lecture_id) {
        return role === 'hod' || user_id === upload_lecture_id;
    }
};

module.exports = AccessCheck;