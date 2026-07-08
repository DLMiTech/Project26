const { pool } = require('../config/db');

const CourseModel = {
    async create({ code, title, credit_hours, description }) {
        const [result] = await pool.execute(
            `INSERT INTO courses (code, title, credit_hours, description, created_at, update_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [code, title, credit_hours, description || null]
        );
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [result.insertId]);
        return rows[0];
    },

    async getAll() {
        const [rows] = await pool.execute('SELECT * FROM courses ORDER BY created_at DESC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async update(id, { code, title, credit_hours, description }) {
        const [result] = await pool.execute(
            `UPDATE courses 
             SET code = ?, title = ?, credit_hours = ?, description = ?, update_at = NOW()
             WHERE id = ?`,
            [code, title, credit_hours, description, id]
        );
        if (result.affectedRows === 0) return null;
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
        return rows[0];
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
        return rows[0];
    },

    async existsByCode(code) {
        const [rows] = await pool.execute('SELECT id FROM courses WHERE code = ?', [code]);
        return rows.length > 0;
    }
};

module.exports = CourseModel;