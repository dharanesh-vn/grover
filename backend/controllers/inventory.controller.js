const Inventory = require('../models/inventory.model');

// @desc    Create a new inventory item
// @route   POST /api/inventory
// @access  Private/Manager
const createItem = async (req, res) => {
  const { itemName, category, quantity, unit, lowStockThreshold } = req.body;

  if (!itemName || !category || quantity == null || !unit || lowStockThreshold == null) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const itemExists = await Inventory.findOne({ itemName });
    if (itemExists) {
      return res.status(400).json({ message: 'An item with this name already exists' });
    }

    const item = new Inventory({
      itemName,
      category,
      quantity,
      unit,
      lowStockThreshold,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Manager
const updateItem = async (req, res) => {
  const { itemName, category, quantity, unit, lowStockThreshold } = req.body;

  try {
    const item = await Inventory.findById(req.params.id);

    if (item) {
      item.itemName = itemName || item.itemName;
      item.category = category || item.category;
      item.quantity = quantity != null ? quantity : item.quantity;
      item.unit = unit || item.unit;
      item.lowStockThreshold = lowStockThreshold != null ? lowStockThreshold : item.lowStockThreshold;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Manager
const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Item removed successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
};