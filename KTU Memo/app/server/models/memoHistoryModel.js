const { pool } = require('../config/db');

const MemoHistory = {
  create: async ({ memoId, actionBy, action, remarks = null }) => {
    const [result] = await pool.execute(
      `INSERT INTO memo_history (memo_id, action_by, action, remarks, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`, [memoId, actionBy, action, remarks]);
    return result.insertId;
  },
  findByMemo: async (memoId) => {
    const [rows] = await pool.execute(
      `SELECT mh.*, u.name as action_by_name, u.role as action_by_role
       FROM memo_history mh JOIN users u ON mh.action_by = u.id WHERE mh.memo_id = ? ORDER BY mh.created_at DESC`, [memoId]);
    return rows;
  }
};

module.exports = MemoHistory;
