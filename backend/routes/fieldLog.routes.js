const express = require('express');
const router = express.Router();
const {
  createFieldLog,
  getAllFieldLogs,
} = require('../controllers/fieldLog.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route for creating a log (any logged-in user) and getting all logs (manager only)
router.route('/')
  .post(protect, createFieldLog)
  .get(protect, isManager, getAllFieldLogs);

module.exports = router;