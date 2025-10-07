const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/user.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route to get all non-manager users, protected and only for managers
router.route('/').get(protect, isManager, getUsers);

module.exports = router;