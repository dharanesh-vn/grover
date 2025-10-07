const Task = require('../models/task.model');
const User = require('../models/user.model');
const Crop = require('../models/crop.model');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Manager
const createTask = async (req, res) => {
  const { taskDescription, assignedTo, cropId, status, dueDate } = req.body;
  if (!taskDescription || !assignedTo || !cropId || !dueDate) { return res.status(400).json({ message: 'Please provide all required fields' }); }
  try {
    const userExists = await User.findById(assignedTo);
    const cropExists = await Crop.findById(cropId);
    if (!userExists || !cropExists) { return res.status(404).json({ message: 'Assigned user or crop not found' }); }
    const task = new Task({ taskDescription, assignedTo, cropId, status, dueDate });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name role').populate('cropId', 'cropName');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get tasks assigned to the logged-in user
// @route   GET /api/tasks/mytasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        // req.user.id is available from our 'protect' middleware
        const tasks = await Task.find({ assignedTo: req.user.id })
            .populate('cropId', 'cropName');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task's status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Security check: Only the assigned user or a manager can update the status
        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'Manager') {
            return res.status(403).json({ message: 'User not authorized to update this task' });
        }
        
        task.status = status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task (Manager only)
// @route   PUT /api/tasks/:id
// @access  Private/Manager
const updateTask = async (req, res) => {
  const { taskDescription, assignedTo, cropId, status, dueDate } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.taskDescription = taskDescription || task.taskDescription;
      task.assignedTo = assignedTo || task.assignedTo;
      task.cropId = cropId || task.cropId;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Manager
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
};