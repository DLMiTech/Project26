const { pool } = require('../config/db');

const Faculty = {
  create: async (name, code) => {
    const [result] = await pool.execute(
      'INSERT INTO faculty (name, code, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [name, code]);
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM faculty ORDER BY name');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM faculty WHERE id = ?', [id]);
    return rows[0] || null;
  },
  update: async (id, name, code) => {
    await pool.execute('UPDATE faculty SET name = ?, code = ?, updated_at = NOW() WHERE id = ?', [name, code, id]);
    return true;
  },
  remove: async (id) => {
    await pool.execute('DELETE FROM faculty WHERE id = ?', [id]);
    return true;
  }
};

module.exports = Faculty;
