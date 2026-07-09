const { pool } = require('../config/db');

const CourseRepositoryModel = {
    async create({ semester_id, course_id }) {
        const [result] = await pool.execute(
            `INSERT INTO course_repository (semester_id, course_id, created_at, update_at)
             VALUES (?, ?, NOW(), NOW())`,
            [semester_id, course_id]
        );
        return this.getById(result.insertId);
    },

    async getAll() {
        const [rows] = await pool.execute(`
            SELECT 
                cr.*,
                r.year as repository_year, sr.name as semester_name, sr.repository_id,
                c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours, c.description as course_description
            FROM course_repository cr
            JOIN semester_repo sr ON cr.semester_id = sr.id
            JOIN repository r ON sr.repository_id = r.id
            JOIN courses c ON cr.course_id = c.id
            ORDER BY r.year DESC, sr.name ASC, c.title ASC
        `);
        return rows;
    },

    async getBySemesterId(semester_id) {
        const [rows] = await pool.execute(`
            SELECT 
                cr.*,
                r.year as repository_year, sr.name as semester_name, sr.repository_id,
                c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours, c.description as course_description
            FROM course_repository cr
            JOIN semester_repo sr ON cr.semester_id = sr.id
            JOIN repository r ON sr.repository_id = r.id
            JOIN courses c ON cr.course_id = c.id
            WHERE cr.semester_id = ?
            ORDER BY c.title ASC
        `, [semester_id]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute(`
            SELECT 
                cr.*,
                r.year as repository_year, sr.name as semester_name, sr.repository_id,
                c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours, c.description as course_description
            FROM course_repository cr
            JOIN semester_repo sr ON cr.semester_id = sr.id
            JOIN repository r ON sr.repository_id = r.id
            JOIN courses c ON cr.course_id = c.id
            WHERE cr.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM course_repository WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM course_repository WHERE id = ?', [id]);
        return rows[0];
    },

    async exists(semester_id, course_id) {
        const [rows] = await pool.execute(
            'SELECT id FROM course_repository WHERE semester_id = ? AND course_id = ?',
            [semester_id, course_id]
        );
        return rows.length > 0;
    }
};

module.exports = CourseRepositoryModel;