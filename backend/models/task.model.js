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
    ref: 'User', // Creates a link to a document in the 'User' collection
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Crop', // Creates a link to a document in the 'Crop' collection
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Completed'], // Predefined list of valid statuses
    default: 'Pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;