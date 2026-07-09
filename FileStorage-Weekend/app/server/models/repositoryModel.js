const { pool } = require('../config/db');

const RepositoryModel = {
    async create({ year }) {
        const [result] = await pool.execute(
            `INSERT INTO repository (year, created_at, update_at)
             VALUES (?, NOW(), NOW())`,
            [year]
        );
        const [rows] = await pool.execute('SELECT * FROM repository WHERE id = ?', [result.insertId]);
        return rows[0];
    },

    async getAll() {
        const [rows] = await pool.execute('SELECT * FROM repository ORDER BY year DESC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.execute('SELECT * FROM repository WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async delete(id) {
        const [rows] = await pool.execute('SELECT * FROM repository WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        await pool.execute('DELETE FROM repository WHERE id = ?', [id]);
        return rows[0];
    },

    async existsByYear(year) {
        const [rows] = await pool.execute('SELECT id FROM repository WHERE year = ?', [year]);
        return rows.length > 0;
    }
};

module.exports = RepositoryModel;