const { pool } = require('../config/db');

const courseModel = {
    // Create course
    create: async (code, title, description, semester, creditHours, lecturerId) => {
        const [result] = await pool.query(
            `INSERT INTO courses (code, title, description, semester, credit_hours, lecturer_id) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [code, title, description, semester, creditHours, lecturerId]
        );
        return result.insertId;
    },

    // Get all courses (with lecturer info)
    getAll: async () => {
        const [rows] = await pool.query(`
            SELECT c.*, u.name as lecturer_name, u.email as lecturer_email 
            FROM courses c
            JOIN users u ON c.lecturer_id = u.id
            ORDER BY c.created_at DESC
        `);
        return rows;
    },

    // Get course by ID
    getById: async (id) => {
        const [rows] = await pool.query(`
            SELECT c.*, u.name as lecturer_name, u.email as lecturer_email 
            FROM courses c
            JOIN users u ON c.lecturer_id = u.id
            WHERE c.id = ?
        `, [id]);
        return rows[0] || null;
    },

    // Get courses by lecturer
    getByLecturer: async (lecturerId) => {
        const [rows] = await pool.query(
            'SELECT * FROM courses WHERE lecturer_id = ? ORDER BY created_at DESC',
            [lecturerId]
        );
        return rows;
    },

    // Get courses by semester
    getBySemester: async (semester) => {
        const [rows] = await pool.query(
            'SELECT c.*, u.name as lecturer_name FROM courses c JOIN users u ON c.lecturer_id = u.id WHERE c.semester = ?',
            [semester]
        );
        return rows;
    },

    // Update course
    update: async (id, updates) => {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);

        const [result] = await pool.query(
            `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    // Delete course
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    // Check if course exists
    exists: async (id) => {
        const [rows] = await pool.query('SELECT id FROM courses WHERE id = ?', [id]);
        return rows.length > 0;
    },

    // Check if code exists
    codeExists: async (code) => {
        const [rows] = await pool.query('SELECT id FROM courses WHERE code = ?', [code]);
        return rows.length > 0;
    }
};

module.exports = courseModel;