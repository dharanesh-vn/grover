const FieldLog = require('../models/fieldLog.model');

// @desc    Create a new field log
// @route   POST /api/fieldlogs
// @access  Private (accessible by Agronomists and Admins)
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
// @access  Private/Admin
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

// @desc    Update a field log
// @route   PUT /api/fieldlogs/:id
// @access  Private/Admin
const updateFieldLog = async (req, res) => {
  const { observationType, notes } = req.body;

  try {
    const log = await FieldLog.findById(req.params.id);

    if (log) {
      log.observationType = observationType || log.observationType;
      log.notes = notes || log.notes;

      const updatedLog = await log.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a field log
// @route   DELETE /api/fieldlogs/:id
// @access  Private/Admin
const deleteFieldLog = async (req, res) => {
  try {
    const log = await FieldLog.findById(req.params.id);

    if (log) {
      await log.deleteOne();
      res.json({ message: 'Log removed successfully' });
    } else {
      res.status(404).json({ message: 'Log not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createFieldLog,
  getAllFieldLogs,
  updateFieldLog,
  deleteFieldLog,
};