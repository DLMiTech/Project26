const { pool } = require('../config/db');

const User = {
  findById: async (id) => {
    const [rows] = await pool.execute('SELECT id, name, email, role, phone, is_verified FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },
  findByEmail: async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  findByRole: async (role) => {
    const [rows] = await pool.execute('SELECT id, name, email, role, phone FROM users WHERE role = ?', [role]);
    return rows;
  },
  findByDepartment: async (departmentId) => {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.phone FROM users u
       JOIN user_department ud ON u.id = ud.user_id WHERE ud.department_id = ?`, [departmentId]);
    return rows;
  }
};

module.exports = User;
