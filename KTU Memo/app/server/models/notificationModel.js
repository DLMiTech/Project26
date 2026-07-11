const { pool } = require('../config/db');

const Notification = {
  create: async ({ memoId, userId, type = 'Email', message, status = 'pending' }) => {
    const [result] = await pool.execute(
      `INSERT INTO notification (memo_id, user_id, type, message, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`, [memoId, userId, type, message, status]);
    return result.insertId;
  },
  findByUser: async (userId) => {
    const [rows] = await pool.execute('SELECT * FROM notification WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },
  findByMemo: async (memoId) => {
    const [rows] = await pool.execute('SELECT * FROM notification WHERE memo_id = ? ORDER BY created_at DESC', [memoId]);
    return rows;
  },
  updateStatus: async (id, status) => {
    await pool.execute('UPDATE notification SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    return true;
  },
  findPending: async () => {
    const [rows] = await pool.execute("SELECT * FROM notification WHERE status = 'pending' ORDER BY created_at ASC");
    return rows;
  }
};

module.exports = Notification;
