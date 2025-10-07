const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    unique: true, // Ensure no duplicate item names
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0,
  },
  unit: {
    type: String,
    required: [true, 'Unit of measurement is required'], // e.g., kg, liters, units
    trim: true,
  },
  lowStockThreshold: {
    type: Number,
    required: [true, 'Low stock threshold is required'],
    min: [0, 'Threshold cannot be negative'],
    default: 10,
  },
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;