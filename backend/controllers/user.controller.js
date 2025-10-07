const User = require('../models/user.model');

// @desc    Get all users (for assignment purposes)
// @route   GET /api/users
// @access  Private/Manager
const getUsers = async (req, res) => {
    try {
        // Find all users but exclude Managers from the list, as tasks are assigned to others.
        // Also, only return the id and name for security and efficiency.
        const users = await User.find({ role: { $ne: 'Manager' } }).select('_id name role');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers
};