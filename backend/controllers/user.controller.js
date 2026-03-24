const User = require('../models/user.model');

// @desc    Get all users (for assignment purposes)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } }).select('_id name role email phone');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a user's details
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const { name, email, role, phone } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
            user.phone = phone || user.phone;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'Admin') {
                return res.status(403).json({ message: 'Cannot delete an Admin.' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser
};