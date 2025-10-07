const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cropSchema = new Schema({
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  cropType: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  area: {
    type: Number,
    required: [true, 'Area is required']
  },
  // Link to the user who manages this crop (optional but good practice)
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;