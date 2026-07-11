const { pool } = require('../config/db');

const Department = {
  create: async (facultyId, name) => {
    const [result] = await pool.execute(
      'INSERT INTO department (faculty_id, name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [facultyId, name]);
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.execute(
      `SELECT d.*, f.name as faculty_name, f.code as faculty_code 
       FROM department d JOIN faculty f ON d.faculty_id = f.id ORDER BY d.name`);
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      `SELECT d.*, f.name as faculty_name, f.code as faculty_code 
       FROM department d JOIN faculty f ON d.faculty_id = f.id WHERE d.id = ?`, [id]);
    return rows[0] || null;
  },
  findByFaculty: async (facultyId) => {
    const [rows] = await pool.execute('SELECT * FROM department WHERE faculty_id = ? ORDER BY name', [facultyId]);
    return rows;
  },
  update: async (id, facultyId, name) => {
    await pool.execute('UPDATE department SET faculty_id = ?, name = ?, updated_at = NOW() WHERE id = ?', [facultyId, name, id]);
    return true;
  },
  remove: async (id) => {
    await pool.execute('DELETE FROM department WHERE id = ?', [id]);
    return true;
  }
};

module.exports = Department;
