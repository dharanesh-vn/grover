const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { protect, isManager } = require('../middleware/auth.middleware');

// Route for a user to get their own tasks
router.route('/mytasks').get(protect, getMyTasks);

// Route to get all tasks (for Managers) and create a new task (for Managers)
router.route('/')
  .get(protect, isManager, getAllTasks)
  .post(protect, isManager, createTask);

// Route for any logged-in user to update a task's status
router.route('/:id/status').put(protect, updateTaskStatus);

// Routes for full task updates and deletion (for Managers only)
router.route('/:id')
  .put(protect, isManager, updateTask)
  .delete(protect, isManager, deleteTask);

module.exports = router;