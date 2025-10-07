const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldLogSchema = new Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Crop',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  observationType: {
    type: String,
    required: [true, 'Observation type is required'],
    enum: ['Growth Update', 'Pest Sighting', 'Disease Concern', 'Irrigation Issue', 'Other'],
  },
  notes: {
    type: String,
    required: [true, 'Notes are required'],
    trim: true,
  },
  logDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const FieldLog = mongoose.model('FieldLog', fieldLogSchema);

module.exports = FieldLog;