const Crop = require('../models/crop.model');
const Task = require('../models/task.model');
const Inventory = require('../models/inventory.model');
const FieldLog = require('../models/fieldLog.model');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
    try {
        // Run all database queries in parallel for efficiency
        const [
            cropCount,
            activeTaskCount,
            lowStockItemCount,
            recentLogs
        ] = await Promise.all([
            Crop.countDocuments(),
            Task.countDocuments({ status: { $ne: 'Completed' } }),
            Inventory.countDocuments({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }),
            FieldLog.find().sort({ createdAt: -1 }).limit(3).populate('submittedBy', 'name').populate('cropId', 'cropName')
        ]);

        res.json({
            cropCount,
            activeTaskCount,
            lowStockItemCount,
            recentLogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching dashboard stats' });
    }
};

module.exports = {
    getDashboardStats
};