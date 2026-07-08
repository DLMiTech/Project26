const { pool } = require('../config/db');

const SemesterRepoModel = {
    async create({ repository_id, name }) {
        const [result] = await pool.execute(
            `INSERT INTO semester_repo (repository_id, name, created_at, update_at)
             VALUES (?, ?, NOW(), NOW())`,
            [repository_id, name]
        );
        return this.getById(result.insertId);
    },

    async getAll() {
        const [rows] = await pool.execute(`
            SELECT sr.*, r.year as repository_year
            FROM semester_repo sr
            JOIN repository r ON sr.repository_id = r.id
            ORDER BY r.year DESC, sr.name ASC
        `);
        return rows;
    },

    async getByRepositoryId(repository_id) {
        const [rows] = await pool.execute(`
            SELECT sr.*, r.year as repository_year
            FROM semester_repo sr
            JOIN repository r ON sr.repository_id = r.id
            WHERE sr.repository_id = ?
            ORDER BY sr.name ASC
        `, [repository_id]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute(`
            SELECT sr.*, r.year as repository_year
            FROM semester_repo sr
            JOIN repository r ON sr.repository_id = r.id
            WHERE sr.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM semester_repo WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM semester_repo WHERE id = ?', [id]);
        return rows[0];
    },

    async existsByNameAndRepo(repository_id, name) {
        const [rows] = await pool.execute(
            'SELECT id FROM semester_repo WHERE repository_id = ? AND name = ?',
            [repository_id, name]
        );
        return rows.length > 0;
    }
};

module.exports = SemesterRepoModel;