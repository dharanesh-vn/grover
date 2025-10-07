const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskDescription: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Crop',
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  // New field to store worker's completion notes
  completionNote: {
      type: String,
      trim: true,
  }
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;