const Notification = require('../models/notificationModel');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user.id);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const getMemoNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findByMemo(req.params.memoId);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.updateStatus(req.params.id, 'sent');
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

module.exports = { getMyNotifications, getMemoNotifications, markAsRead };
