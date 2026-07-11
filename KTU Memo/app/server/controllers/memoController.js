const Memo = require('../models/memoModel');
const User = require('../models/userModel');
const MemoHistory = require('../models/memoHistoryModel');
const Notification = require('../models/notificationModel');

const createMemo = async (req, res) => {
  try {
    const { subject, content, recipient_id, priority = 'normal' } = req.body;
    const sender_id = req.user.id;
    if (!subject || !content || !recipient_id) return res.status(400).json({ message: 'Subject, content, and recipient_id are required' });

    const recipient = await User.findById(recipient_id);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const senderRole = req.user.role;
    const recipientRole = recipient.role;
    const validWorkflows = { 'lecture': ['hod'], 'hod': ['dean', 'lecture'], 'dean': ['admin', 'hod'], 'admin': ['dean'] };
    if (validWorkflows[senderRole] && !validWorkflows[senderRole].includes(recipientRole)) {
      return res.status(400).json({ message: 'Invalid workflow: Cannot send memo to this recipient role' });
    }

    const memoId = await Memo.create({ subject, content, senderId: sender_id, recipientId: recipient_id, priority });
    await MemoHistory.create({ memoId, actionBy: sender_id, action: 'Submitted', remarks: 'Memo created and submitted' });
    await Notification.create({ memoId, userId: recipient_id, message: `New memo received from ${req.user.name}: ${subject}` });
    const memo = await Memo.findById(memoId);
    res.status(201).json({ message: 'Memo created successfully', memo });
  } catch (error) {
    res.status(500).json({ message: 'Error creating memo', error: error.message });
  }
};

const getMyMemos = async (req, res) => {
  try {
    const memos = await Memo.findAllForUser(req.user.id);
    res.json({ memos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memos', error: error.message });
  }
};

const getSentMemos = async (req, res) => {
  try {
    const memos = await Memo.findBySender(req.user.id);
    res.json({ memos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent memos', error: error.message });
  }
};

const getReceivedMemos = async (req, res) => {
  try {
    const memos = await Memo.findByRecipient(req.user.id);
    res.json({ memos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching received memos', error: error.message });
  }
};

const getMemoById = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.sender_id !== req.user.id && memo.recipient_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const attachments = []; // fetch separately if needed
    const history = await MemoHistory.findByMemo(req.params.id);
    res.json({ memo, attachments, history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memo', error: error.message });
  }
};

const updateMemo = async (req, res) => {
  try {
    const { subject, content, priority } = req.body;
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.sender_id !== req.user.id) return res.status(403).json({ message: 'Only sender can update memo' });
    if (memo.status !== 'Draft') return res.status(400).json({ message: 'Only draft memos can be updated' });
    await Memo.update(req.params.id, { subject, content, priority });
    res.json({ message: 'Memo updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating memo', error: error.message });
  }
};

const deleteMemo = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.sender_id !== req.user.id) return res.status(403).json({ message: 'Only sender can delete memo' });
    if (memo.status !== 'Draft') return res.status(400).json({ message: 'Only draft memos can be deleted' });
    await Memo.remove(req.params.id);
    res.json({ message: 'Memo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting memo', error: error.message });
  }
};

const approveMemo = async (req, res) => {
  try {
    const { remarks } = req.body;
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.recipient_id !== req.user.id) return res.status(403).json({ message: 'Only recipient can approve' });
    if (memo.status !== 'pending') return res.status(400).json({ message: 'Only pending memos can be approved' });
    await Memo.updateStatus(req.params.id, 'Approved');
    await MemoHistory.create({ memoId: req.params.id, actionBy: req.user.id, action: 'Approved', remarks: remarks || 'Memo approved' });
    await Notification.create({ memoId: req.params.id, userId: memo.sender_id, message: `Your memo "${memo.subject}" has been approved by ${req.user.name}` });
    res.json({ message: 'Memo approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving memo', error: error.message });
  }
};

const rejectMemo = async (req, res) => {
  try {
    const { remarks } = req.body;
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.recipient_id !== req.user.id) return res.status(403).json({ message: 'Only recipient can reject' });
    if (memo.status !== 'pending') return res.status(400).json({ message: 'Only pending memos can be rejected' });
    await Memo.updateStatus(req.params.id, 'Rejected');
    await MemoHistory.create({ memoId: req.params.id, actionBy: req.user.id, action: 'Rejected', remarks: remarks || 'Memo rejected' });
    await Notification.create({ memoId: req.params.id, userId: memo.sender_id, message: `Your memo "${memo.subject}" has been rejected by ${req.user.name}` });
    res.json({ message: 'Memo rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting memo', error: error.message });
  }
};

const forwardMemo = async (req, res) => {
  try {
    const { forward_to_id, remarks } = req.body;
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.recipient_id !== req.user.id) return res.status(403).json({ message: 'Only recipient can forward' });
    if (memo.status !== 'pending') return res.status(400).json({ message: 'Only pending memos can be forwarded' });
    const forwardTo = await User.findById(forward_to_id);
    if (!forwardTo) return res.status(404).json({ message: 'Forward recipient not found' });
    await Memo.updateRecipient(req.params.id, forward_to_id, 'pending');
    await MemoHistory.create({ memoId: req.params.id, actionBy: req.user.id, action: 'Forward', remarks: remarks || `Forwarded to ${forwardTo.name}` });
    await Notification.create({ memoId: req.params.id, userId: forward_to_id, message: `Memo "${memo.subject}" has been forwarded to you by ${req.user.name}` });
    await Notification.create({ memoId: req.params.id, userId: memo.sender_id, message: `Your memo "${memo.subject}" has been forwarded by ${req.user.name}` });
    res.json({ message: 'Memo forwarded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error forwarding memo', error: error.message });
  }
};

const submitMemo = async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.sender_id !== req.user.id) return res.status(403).json({ message: 'Only sender can submit' });
    if (memo.status !== 'Draft') return res.status(400).json({ message: 'Only draft memos can be submitted' });
    await Memo.updateStatus(req.params.id, 'pending');
    await MemoHistory.create({ memoId: req.params.id, actionBy: req.user.id, action: 'Submitted', remarks: 'Memo submitted for review' });
    await Notification.create({ memoId: req.params.id, userId: memo.recipient_id, message: `New memo "${memo.subject}" submitted by ${req.user.name} requires your action` });
    res.json({ message: 'Memo submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting memo', error: error.message });
  }
};

const getPendingMemos = async (req, res) => {
  try {
    const memos = await Memo.findPendingByRole(req.user.role);
    res.json({ memos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending memos', error: error.message });
  }
};

module.exports = {
  createMemo, getMyMemos, getSentMemos, getReceivedMemos, getMemoById,
  updateMemo, deleteMemo, approveMemo, rejectMemo, forwardMemo, submitMemo, getPendingMemos
};
