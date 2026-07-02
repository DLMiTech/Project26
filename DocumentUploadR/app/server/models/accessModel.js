const { pool } = require('../config/db');

const accessModel = {
    // Create access grant
    create: async (hodId, lecturerId, courseId, semester, accessLevel, startDatetime, endDatetime, note) => {
        const [result] = await pool.query(
            `INSERT INTO access_controls 
             (hod_id, lecturer_id, course_id, semester, access_level, start_datetime, end_datetime, note) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [hodId, lecturerId, courseId, semester, accessLevel, startDatetime, endDatetime, note || null]
        );
        return result.insertId;
    },

    // Get all access controls (with details)
    getAll: async () => {
        const [rows] = await pool.query(`
            SELECT 
                ac.*,
                h.name as hod_name,
                l.name as lecturer_name,
                l.email as lecturer_email,
                c.code as course_code,
                c.title as course_title
            FROM access_controls ac
            JOIN users h ON ac.hod_id = h.id
            JOIN users l ON ac.lecturer_id = l.id
            JOIN courses c ON ac.course_id = c.id
            ORDER BY ac.created_at DESC
        `);
        return rows;
    },

    // Get access by ID
    getById: async (id) => {
        const [rows] = await pool.query(`
            SELECT 
                ac.*,
                h.name as hod_name,
                l.name as lecturer_name,
                l.email as lecturer_email,
                c.code as course_code,
                c.title as course_title
            FROM access_controls ac
            JOIN users h ON ac.hod_id = h.id
            JOIN users l ON ac.lecturer_id = l.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.id = ?
        `, [id]);
        return rows[0] || null;
    },

    // Get access granted by HOD
    getByHod: async (hodId) => {
        const [rows] = await pool.query(`
            SELECT 
                ac.*,
                l.name as lecturer_name,
                l.email as lecturer_email,
                c.code as course_code,
                c.title as course_title
            FROM access_controls ac
            JOIN users l ON ac.lecturer_id = l.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.hod_id = ?
            ORDER BY ac.created_at DESC
        `, [hodId]);
        return rows;
    },

    // Get access for a lecturer
    getByLecturer: async (lecturerId) => {
        const [rows] = await pool.query(`
            SELECT 
                ac.*,
                h.name as hod_name,
                c.code as course_code,
                c.title as course_title
            FROM access_controls ac
            JOIN users h ON ac.hod_id = h.id
            JOIN courses c ON ac.course_id = c.id
            WHERE ac.lecturer_id = ? AND ac.is_active = TRUE
            AND NOW() BETWEEN ac.start_datetime AND ac.end_datetime
            ORDER BY ac.created_at DESC
        `, [lecturerId]);
        return rows;
    },

    // Get active access for lecturer on specific course
    getLecturerCourseAccess: async (lecturerId, courseId) => {
        const [rows] = await pool.query(`
            SELECT * FROM access_controls 
            WHERE lecturer_id = ? AND course_id = ? AND is_active = TRUE
            AND NOW() BETWEEN start_datetime AND end_datetime
            LIMIT 1
        `, [lecturerId, courseId]);
        return rows[0] || null;
    },

    // Update access
    update: async (id, updates) => {
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);

        const [result] = await pool.query(
            `UPDATE access_controls SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    // Delete access
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM access_controls WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    // Check if access exists
    exists: async (id) => {
        const [rows] = await pool.query('SELECT id FROM access_controls WHERE id = ?', [id]);
        return rows.length > 0;
    },

    // Check for duplicate access
    checkDuplicate: async (lecturerId, courseId, semester) => {
        const [rows] = await pool.query(
            'SELECT id FROM access_controls WHERE lecturer_id = ? AND course_id = ? AND semester = ? AND is_active = TRUE',
            [lecturerId, courseId, semester]
        );
        return rows.length > 0;
    }
};

module.exports = accessModel