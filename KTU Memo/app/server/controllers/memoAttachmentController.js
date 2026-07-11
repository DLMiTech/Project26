const MemoAttachment = require('../models/memoAttachmentModel');
const Memo = require('../models/memoModel');

const addAttachment = async (req, res) => {
  try {
    const { memo_id } = req.body;
    const path = req.file ? req.file.path : req.body.path;
    if (!memo_id || !path) return res.status(400).json({ message: 'Memo ID and path are required' });
    const memo = await Memo.findById(memo_id);
    if (!memo) return res.status(404).json({ message: 'Memo not found' });
    if (memo.sender_id !== req.user.id) return res.status(403).json({ message: 'Only sender can add attachments' });
    const attachmentId = await MemoAttachment.create(memo_id, path);
    res.status(201).json({ message: 'Attachment added successfully', attachmentId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding attachment', error: error.message });
  }
};

const getAttachments = async (req, res) => {
  try {
    const attachments = await MemoAttachment.findByMemo(req.params.memoId);
    res.json({ attachments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attachments', error: error.message });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    await MemoAttachment.remove(req.params.id);
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attachment', error: error.message });
  }
};

module.exports = { addAttachment, getAttachments, deleteAttachment };
