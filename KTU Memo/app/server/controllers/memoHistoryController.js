const MemoHistory = require('../models/memoHistoryModel');

const getMemoHistory = async (req, res) => {
  try {
    const history = await MemoHistory.findByMemo(req.params.memoId);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memo history', error: error.message });
  }
};

module.exports = { getMemoHistory };
