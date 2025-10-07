const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem
} = require('../controllers/inventory.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route to get all items (for any logged-in user) and create a new item (Managers only)
router.route('/')
  .get(protect, getAllItems)
  .post(protect, isManager, createItem);

// Routes for single item operations (update, delete - Managers only)
router.route('/:id')
  .put(protect, isManager, updateItem)
  .delete(protect, isManager, deleteItem);

module.exports = router;