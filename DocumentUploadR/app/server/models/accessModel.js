const { pool } = require('../config/db');

const accessModel = {
    // Create access grant
    create: async (lecturerId, courseId, semester, accessLevel, note) => {
        const [result] = await pool.query(
            `INSERT INTO access_controls 
             (lecturer_id, course_id, semester, access_level, note) 
             VALUES (?, ?, ?, ?,?)`,
            [lecturerId, courseId, semester, accessLevel, note || null]
        );
        return result.insertId;
    },

    // Get access granted by HOD
    getPendingAccess: async () => {
        const [rows] = await pool.query(
            `
                SELECT
                    ac.*,
                    u.id AS lecturer_id,
                    u.name AS lecturer_name,
                    u.email AS lecturer_email,
                    c.code AS course_code,
                    c.title AS course_title
                FROM access_controls ac
                         JOIN users u
                              ON ac.lecturer_id = u.id
                         JOIN courses c
                              ON ac.course_id = c.id
                WHERE ac.status = 'pending'
                ORDER BY ac.created_at DESC
            `
        );

        return rows;
    },

    getAccess: async () => {
        const [rows] = await pool.query(
            `
                SELECT
                    ac.*,
                    u.id AS lecturer_id,
                    u.name AS lecturer_name,
                    u.email AS lecturer_email,
                    c.code AS course_code,
                    c.title AS course_title
                FROM access_controls ac
                         JOIN users u
                              ON ac.lecturer_id = u.id
                         JOIN courses c
                              ON ac.course_id = c.id
                ORDER BY ac.created_at DESC
            `
        );
        return rows;
    },

    // Get access for a lecturer
    getByLecturer: async (lecturerId) => {
        const [rows] = await pool.query(
            `
                SELECT
                    ac.*,
                    c.code AS course_code,
                    c.title AS course_title
                FROM access_controls ac
                         JOIN courses c ON ac.course_id = c.id
                WHERE ac.lecturer_id = ?
                ORDER BY
                    FIELD(ac.status, 'pending', 'approve', 'decline'),
                    ac.created_at DESC
            `,
            [lecturerId]
        );
        return rows;
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
    checkDuplicate: async (lecturerId, courseId) => {
        const [rows] = await pool.query(
            'SELECT id FROM access_controls WHERE lecturer_id = ? AND course_id = ? AND status = ? AND is_active = TRUE',
            [lecturerId, courseId, 'pending']
        );
        return rows.length > 0;
    }
};

module.exports = accessModel