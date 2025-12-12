const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/mailService');

// @desc    Get all users
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        console.log(`DEBUG: Found ${users.length} users in DB`);
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
        // DEBUG: Check data quality
        const sampleUser = await User.findOne();
        console.log('DEBUG: Analytics Sample User:', sampleUser);

        // Group by State
        const usersByState = await User.aggregate([
            { $group: { _id: { $toLower: "$state" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('DEBUG: Aggregation State Result:', usersByState);

        // Group by City
        const usersByCity = await User.aggregate([
            { $group: { _id: { $toLower: "$city" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('DEBUG: Aggregation City Result:', usersByCity);

        // Email Domain Distribution (Interesting Stat!)
        // MongoDB doesn't have a simple split in older versions, but we can do it with regex or just simple string ops if version allows.
        // Fallback: Fetch all emails and process in Node if DB is limited, but aggregation is better.
        // Using $substr and $strLenCP if complex, but let's try a simple approach or simple regex.
        // Actually, for a small app, processing in Node is perfectly fine and safer for compatibility.
        // Let's stick to aggregation for performance if possible, but simplest is process in Node for this assignment.

        // Alternative: Just group by Email Provider (simulated in Node for clarity/safety on unknown Mongo versions)
        const allUsers = await User.find({}, 'email createdAt');

        const domains = {};
        allUsers.forEach(u => {
            if (u.email) {
                const parts = u.email.split('@');
                if (parts.length > 1) {
                    const domain = parts[1];
                    domains[domain] = (domains[domain] || 0) + 1;
                }
            }
        });
        const usersByDomain = Object.entries(domains)
            .map(([domain, count]) => ({ _id: domain, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Growth (Last 7 Days)
        const last7Days = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            last7Days[d.toISOString().split('T')[0]] = 0;
        }

        allUsers.forEach(u => {
            if (u.createdAt) {
                const dateStr = u.createdAt.toISOString().split('T')[0];
                if (last7Days[dateStr] !== undefined) {
                    last7Days[dateStr]++;
                }
            }
        });
        const userGrowth = Object.entries(last7Days).map(([date, count]) => ({ _id: date, count }));

        res.json({
            success: true,
            data: {
                byState: usersByState,
                byCity: usersByCity,
                byDomain: usersByDomain,
                growth: userGrowth
            }
        });
    } catch (err) {
        console.error('Analytics Error:', err);
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
