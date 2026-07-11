const { pool } = require('../config/db');

const MemoAttachment = {
  create: async (memoId, path) => {
    const [result] = await pool.execute(
      'INSERT INTO memo_attachment (memo_id, path, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [memoId, path]);
    return result.insertId;
  },
  findByMemo: async (memoId) => {
    const [rows] = await pool.execute('SELECT * FROM memo_attachment WHERE memo_id = ?', [memoId]);
    return rows;
  },
  remove: async (id) => {
    await pool.execute('DELETE FROM memo_attachment WHERE id = ?', [id]);
    return true;
  }
};

module.exports = MemoAttachment;
