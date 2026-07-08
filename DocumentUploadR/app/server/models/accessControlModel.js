const { pool } = require('../config/db');

const AccessControlModel = {
    async create({ user_id, course_id, access_level, start_datetime, end_datetime, note }) {
        const [result] = await pool.execute(
            `INSERT INTO access_control (user_id, course_id, access_level, start_datetime, end_datetime, note, status, created_at, update_at)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
            [user_id, course_id, access_level, start_datetime || null, end_datetime || null, note || null]
        );
        return this.getById(result.insertId);
    },

    async getAll() {
        const [rows] = await pool.execute(`
            SELECT 
                ac.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours
            FROM access_control ac
            JOIN users u ON ac.user_id = u.id
            JOIN courses c ON ac.course_id = c.id
            ORDER BY ac.created_at DESC
        `);
        return rows;
    },

    async getAllByLectureId(user_id) {
        const [rows] = await pool.execute(`
            SELECT 
                ac.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours
            FROM access_control ac
            JOIN users u ON ac.user_id = u.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.user_id = ?
            ORDER BY ac.created_at DESC
        `, [user_id]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute(`
            SELECT 
                ac.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title
            FROM access_control ac
            JOIN users u ON ac.user_id = u.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async grantAccess(id, { start_datetime, end_datetime, status }) {
        await pool.execute(
            `UPDATE access_control 
             SET start_datetime = ?, end_datetime = ?, status = ?, update_at = NOW()
             WHERE id = ?`,
            [start_datetime, end_datetime, status, id]
        );
        return this.getById(id);
    },

    async declineAccess(id, { status }) {
        await pool.execute(
            `UPDATE access_control 
             SET status = ?, update_at = NOW()
             WHERE id = ?`,
            [status, id]
        );
        return this.getById(id);
    },

    async grantAccessToAll(course_id, { start_datetime, end_datetime, status }) {
        await pool.execute(
            `UPDATE access_control 
             SET start_datetime = ?, end_datetime = ?, status = ?, update_at = NOW()
             WHERE course_id = ? AND status = 'pending'`,
            [start_datetime, end_datetime, status, course_id]
        );
        const [rows] = await pool.execute(
            'SELECT * FROM access_control WHERE course_id = ? AND status = ?',
            [course_id, status]
        );
        return rows;
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM access_control WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM access_control WHERE id = ?', [id]);
        return rows[0];
    },

    async getPendingByCourse(course_id) {
        const [rows] = await pool.execute(`
            SELECT ac.*, u.name, u.email 
            FROM access_control ac
            JOIN user u ON ac.user_id = u.id
            WHERE ac.course_id = ? AND ac.status = 'pending'
        `, [course_id]);
        return rows;
    }
};

module.exports = AccessControlModel;