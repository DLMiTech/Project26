const { pool } = require('../config/db');

const LectureCourseModel = {
    async create({ user_id, course_id, semester }) {
        const [result] = await pool.execute(
            `INSERT INTO lecture_courses (user_id, course_id, semester, created_at, update_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [user_id, course_id, semester]
        );
        return this.getById(result.insertId);
    },

    async getAll() {
        const [rows] = await pool.execute(`
            SELECT 
                lc.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title,
                c.credit_hours as course_credit_hours, c.description as course_description
            FROM lecture_courses lc
            JOIN users u ON lc.user_id = u.id
            JOIN courses c ON lc.course_id = c.id
            ORDER BY lc.created_at DESC
        `);
        return rows;
    },

    async getByLecture(user_id) {
        const [rows] = await pool.execute(`
            SELECT 
                lc.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title,
                c.credit_hours as course_credit_hours, c.description as course_description
            FROM lecture_courses lc
            JOIN users u ON lc.user_id = u.id
            JOIN courses c ON lc.course_id = c.id
            WHERE lc.user_id = ?
            ORDER BY lc.created_at DESC
        `, [user_id]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute(`
            SELECT 
                lc.*,
                u.id as lecture_id, u.name as lecture_name, u.email as lecture_email,
                c.id as course_id, c.code as course_code, c.title as course_title,
                c.credit_hours as course_credit_hours, c.description as course_description
            FROM lecture_courses lc
            JOIN users u ON lc.user_id = u.id
            JOIN courses c ON lc.course_id = c.id
            WHERE lc.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM lecture_courses WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM lecture_courses WHERE id = ?', [id]);
        return rows[0];
    },

    async exists(user_id, course_id, semester) {
        const [rows] = await pool.execute(
            'SELECT id FROM lecture_courses WHERE user_id = ? AND course_id = ? AND semester = ?',
            [user_id, course_id, semester]
        );
        return rows.length > 0;
    }
};

module.exports = LectureCourseModel;