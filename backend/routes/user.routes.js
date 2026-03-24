const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route to get all non-admin users, protected and only for admins
router.route('/')
  .get(protect, isManager, getUsers);

router.route('/:id')
  .put(protect, isManager, updateUser)
  .delete(protect, isManager, deleteUser);

module.exports = router;