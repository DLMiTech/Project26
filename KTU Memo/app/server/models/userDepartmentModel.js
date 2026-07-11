const { pool } = require('../config/db');

const UserDepartment = {
  join: async (userId, departmentId) => {
    const [result] = await pool.execute(
      'INSERT INTO user_department (user_id, department_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [userId, departmentId]);
    return result.insertId;
  },
  remove: async (userId, departmentId) => {
    await pool.execute('DELETE FROM user_department WHERE user_id = ? AND department_id = ?', [userId, departmentId]);
    return true;
  },
  findByUser: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT ud.*, d.name as department_name, f.name as faculty_name
       FROM user_department ud JOIN department d ON ud.department_id = d.id
       JOIN faculty f ON d.faculty_id = f.id WHERE ud.user_id = ?`, [userId]);
    return rows;
  },
  findByDepartment: async (departmentId) => {
    const [rows] = await pool.execute(
      `SELECT ud.*, u.name, u.email, u.role, u.phone
       FROM user_department ud JOIN users u ON ud.user_id = u.id WHERE ud.department_id = ?`, [departmentId]);
    return rows;
  }
};

module.exports = UserDepartment;
