const FieldLog = require('../models/fieldLog.model');

// @desc    Create a new field log
// @route   POST /api/fieldlogs
// @access  Private (accessible by Farmers and Managers)
const createFieldLog = async (req, res) => {
  const { cropId, observationType, notes } = req.body;

  if (!cropId || !observationType || !notes) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const fieldLog = new FieldLog({
      cropId,
      observationType,
      notes,
      submittedBy: req.user.id, // ID comes from the 'protect' middleware
    });

    const createdLog = await fieldLog.save();
    res.status(201).json(createdLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all field logs
// @route   GET /api/fieldlogs
// @access  Private/Manager
const getAllFieldLogs = async (req, res) => {
  try {
    const logs = await FieldLog.find({})
      .populate('cropId', 'cropName')
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 }); // Show the newest logs first

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createFieldLog,
  getAllFieldLogs,
};