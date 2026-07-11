const { pool } = require('../config/db');

const Memo = {
  create: async ({ subject, content, senderId, recipientId, priority = 'normal' }) => {
    const [result] = await pool.execute(
      `INSERT INTO memos (subject, content, sender_id, recipient_id, status, priority, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 'Draft', ?, NOW(), NOW())`, [subject, content, senderId, recipientId, priority]);
    return result.insertId;
  },
  findById: async (id) => {
    const [rows] = await pool.execute(
      `SELECT m.*, s.name as sender_name, s.email as sender_email, s.role as sender_role,
        r.name as recipient_name, r.email as recipient_email, r.role as recipient_role
       FROM memos m JOIN users s ON m.sender_id = s.id JOIN users r ON m.recipient_id = r.id WHERE m.id = ?`, [id]);
    return rows[0] || null;
  },
  findBySender: async (senderId) => {
    const [rows] = await pool.execute(
      `SELECT m.*, r.name as recipient_name, r.email as recipient_email, r.role as recipient_role
       FROM memos m JOIN users r ON m.recipient_id = r.id WHERE m.sender_id = ? ORDER BY m.created_at DESC`, [senderId]);
    return rows;
  },
  findByRecipient: async (recipientId) => {
    const [rows] = await pool.execute(
      `SELECT m.*, s.name as sender_name, s.email as sender_email, s.role as sender_role
       FROM memos m JOIN users s ON m.sender_id = s.id WHERE m.recipient_id = ? ORDER BY m.created_at DESC`, [recipientId]);
    return rows;
  },
  findAllForUser: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT m.*, s.name as sender_name, s.role as sender_role,
        r.name as recipient_name, r.role as recipient_role
       FROM memos m JOIN users s ON m.sender_id = s.id JOIN users r ON m.recipient_id = r.id
       WHERE m.sender_id = ? OR m.recipient_id = ? ORDER BY m.created_at DESC`, [userId, userId]);
    return rows;
  },
  update: async (id, { subject, content, priority }) => {
    await pool.execute('UPDATE memos SET subject = ?, content = ?, priority = ?, updated_at = NOW() WHERE id = ?',
      [subject, content, priority, id]);
    return true;
  },
  updateStatus: async (id, status) => {
    await pool.execute('UPDATE memos SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    return true;
  },
  updateRecipient: async (id, recipientId, status) => {
    await pool.execute('UPDATE memos SET recipient_id = ?, status = ?, updated_at = NOW() WHERE id = ?', [recipientId, status, id]);
    return true;
  },
  remove: async (id) => {
    await pool.execute('DELETE FROM memos WHERE id = ?', [id]);
    return true;
  },
  findPendingByRole: async (role) => {
    const [rows] = await pool.execute(
      `SELECT m.*, s.name as sender_name, s.role as sender_role,
        r.name as recipient_name, r.role as recipient_role
       FROM memos m JOIN users s ON m.sender_id = s.id JOIN users r ON m.recipient_id = r.id
       WHERE m.status = 'pending' AND r.role = ? ORDER BY m.priority DESC, m.created_at DESC`, [role]);
    return rows;
  }
};

module.exports = Memo;
