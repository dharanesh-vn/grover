const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route to get all dashboard stats, protected and only for managers
router.route('/stats').get(protect, isManager, getDashboardStats);

module.exports = router;