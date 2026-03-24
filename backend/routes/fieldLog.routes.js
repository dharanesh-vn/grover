const express = require('express');
const router = express.Router();
const {
  createFieldLog,
  getAllFieldLogs,
  updateFieldLog,
  deleteFieldLog,
} = require('../controllers/fieldLog.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route for creating a log (any logged-in user) and getting all logs (admin only)
router.route('/')
  .post(protect, createFieldLog)
  .get(protect, isManager, getAllFieldLogs);

// Routes for update and delete (admin only)
router.route('/:id')
  .put(protect, isManager, updateFieldLog)
  .delete(protect, isManager, deleteFieldLog);

module.exports = router;