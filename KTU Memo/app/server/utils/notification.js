const { pool } = require('../config/db');

const sendNotification = async ({ memoId, userId, message, type = 'Email' }) => {
    try {
        await pool.execute(
            `INSERT INTO notification (memo_id, user_id, type, message, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())`,
            [memoId, userId, type, message]
        );
        console.log(`[NOTIFICATION] ${type} to user ${userId}: ${message}`);
        return true;
    } catch (error) {
        console.error('Notification error:', error);
        return false;
    }
};

const processPendingNotifications = async () => {
    try {
        const [pending] = await pool.execute("SELECT * FROM notification WHERE status = 'pending' ORDER BY created_at ASC");
        for (const notification of pending) {
            console.log(`Processing notification ${notification.id}`);
            await pool.execute('UPDATE notification SET status = ?, updated_at = NOW() WHERE id = ?', ['sent', notification.id]);
        }
    } catch (error) {
        console.error('Error processing notifications:', error);
    }
};

module.exports = {
    sendNotification,
    processPendingNotifications
};
