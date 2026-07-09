const { pool } = require('../config/db');

const UploadModel = {
    async create({ course_repository_id, lecture_id, file_path, index_number, serial_number }) {
        const [result] = await pool.execute(
            `INSERT INTO uploads (course_repository_id, lecture_id, file_path, index_number, serial_number, created_at, update_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [course_repository_id, lecture_id, file_path, index_number || null, serial_number || null]
        );
        return this.getById(result.insertId);
    },

    async getAllCourseUpload(course_repository_id) {
        const [rows] = await pool.execute(`
            SELECT 
                u.*,
                cr.semester_id, cr.course_id,
                r.year as repository_year, sr.name as semester_name, sr.repository_id,
                c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours, c.description as course_description,
                users.name as lecture_name, users.email as lecture_email
            FROM uploads u
            JOIN course_repository cr ON u.course_repository_id = cr.id
            JOIN semester_repo sr ON cr.semester_id = sr.id
            JOIN repository r ON sr.repository_id = r.id
            JOIN courses c ON cr.course_id = c.id
            JOIN users ON u.lecture_id = users.id
            WHERE u.course_repository_id = ?
            ORDER BY u.index_number ASC, u.serial_number ASC, u.created_at DESC
        `, [course_repository_id]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute(`
            SELECT 
                u.*,
                cr.semester_id, cr.course_id,
                r.year as repository_year, sr.name as semester_name, sr.repository_id,
                c.code as course_code, c.title as course_title, c.credit_hours as course_credit_hours, c.description as course_description,
                users.name as lecture_name, users.email as lecture_email
            FROM uploads u
            JOIN course_repository cr ON u.course_repository_id = cr.id
            JOIN semester_repo sr ON cr.semester_id = sr.id
            JOIN repository r ON sr.repository_id = r.id
            JOIN courses c ON cr.course_id = c.id
            JOIN users ON u.lecture_id = users.id
            WHERE u.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async update(id, { file_path, index_number, serial_number }) {
        const [result] = await pool.execute(
            `UPDATE uploads 
             SET file_path = COALESCE(?, file_path), 
                 index_number = COALESCE(?, index_number), 
                 serial_number = COALESCE(?, serial_number), 
                 update_at = NOW()
             WHERE id = ?`,
            [file_path, index_number, serial_number, id]
        );
        if (result.affectedRows === 0) return null;
        return this.getById(id);
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM uploads WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM uploads WHERE id = ?', [id]);
        return rows[0];
    },

    async getCourseIdByUploadId(upload_id) {
        const [rows] = await pool.execute(`
            SELECT cr.course_id 
            FROM uploads u
            JOIN course_repository cr ON u.course_repository_id = cr.id
            WHERE u.id = ?
        `, [upload_id]);
        return rows[0]?.course_id || null;
    }
};

module.exports = UploadModel;