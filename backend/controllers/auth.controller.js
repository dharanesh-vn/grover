const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone || !role) { return res.status(400).json({ message: 'Please enter all required fields.' }); }
    if (password.length < 8) { return res.status(400).json({ message: 'Password must be at least 8 characters long.' }); }
    try {
        let user = await User.findOne({ email: email });
        if (user) { return res.status(400).json({ message: 'User with this email already exists.' }); }
        user = new User({ name, email, password, phone, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Please provide an email and password.' }); }
    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'Invalid credentials.' }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid credentials.' }); }
        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};