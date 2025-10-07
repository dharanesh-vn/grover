const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Primary Key Constraint: Ensures no two users can have the same email
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email format validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'] // Password strength
  },
  role: {
    type: String,
    required: true,
    enum: ['Manager', 'Farmer', 'Worker'], // Ensures role can only be one of these values
    default: 'Farmer'
  },
  phone: {
      type: String,
      required: [true, 'Phone number is required']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;