const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/mailService');

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
};

// @desc    Create new user
// @route   POST /api/users
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        // Try to send email, but don't fail the request if email fails
        try {
            await sendWelcomeEmail(user);
        } catch (emailErr) {
            console.error('Email failed to send:', emailErr);
        }

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        // Validation error
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Update failed' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Delete failed' });
    }
};

// @desc    Get Analytics (Users by state/city)
// @route   GET /api/analytics/regions
const getAnalytics = async (req, res) => {
    try {
        // Group by State
        const usersByState = await User.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } }
        ]);

        // Group by City
        const usersByCity = await User.aggregate([
            { $group: { _id: "$city", count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                byState: usersByState,
                byCity: usersByCity
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Analytics Error' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics
};
