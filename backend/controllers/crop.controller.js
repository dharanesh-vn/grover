const Crop = require('../models/crop.model');

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Private/Manager
const createCrop = async (req, res) => {
    const { cropName, cropType, plantingDate, expectedHarvestDate, area } = req.body;

    if (!cropName || !cropType || !plantingDate || !expectedHarvestDate || !area) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const crop = new Crop({
            cropName,
            cropType,
            plantingDate,
            expectedHarvestDate,
            area,
            managedBy: req.user.id // Assign the logged-in manager
        });

        const createdCrop = await crop.save();
        res.status(201).json(createdCrop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all crops
// @route   GET /api/crops
// @access  Private
const getAllCrops = async (req, res) => {
    try {
        const crops = await Crop.find({}).populate('managedBy', 'name'); // Populate manager's name
        res.json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            res.json(crop);
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a crop
// @route   PUT /api/crops/:id
// @access  Private/Manager
const updateCrop = async (req, res) => {
    const { cropName, cropType, plantingDate, expectedHarvestDate, area } = req.body;

    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            crop.cropName = cropName || crop.cropName;
            crop.cropType = cropType || crop.cropType;
            crop.plantingDate = plantingDate || crop.plantingDate;
            crop.expectedHarvestDate = expectedHarvestDate || crop.expectedHarvestDate;
            crop.area = area || crop.area;

            const updatedCrop = await crop.save();
            res.json(updatedCrop);
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private/Manager
const deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);

        if (crop) {
            await crop.deleteOne();
            res.json({ message: 'Crop removed successfully' });
        } else {
            res.status(404).json({ message: 'Crop not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCrop,
    getAllCrops,
    getCropById,
    updateCrop,
    deleteCrop
};