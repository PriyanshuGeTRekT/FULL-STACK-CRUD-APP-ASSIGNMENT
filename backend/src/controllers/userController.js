const User = require('../models/User');
const { sendWelcomeEmail, sendNotificationEmail } = require('../services/mailService');

// Grabs everyone. (GET /api/users)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        console.log(`DEBUG: Found ${users.length} users in DB`);
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Finds just one person. (GET /api/users/:id)
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

// Adds a new face. (POST /api/users)
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        // Try sending the welcome email, but don't crash if it bounces.
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
        // Handle validation mishaps.
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Updates their info. (PUT /api/users/:id)
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

// Removes them from the DB. (DELETE /api/users/:id)
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

// Crunches the numbers. (GET /api/analytics/regions)
const getAnalytics = async (req, res) => {
    try {
        // Quick data quality check.
        const sampleUser = await User.findOne();
        console.log('DEBUG: Analytics Sample User:', sampleUser);

        // Grouping by State.
        const usersByState = await User.aggregate([
            { $group: { _id: { $toLower: "$state" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('DEBUG: Aggregation State Result:', usersByState);

        // Grouping by City.
        const usersByCity = await User.aggregate([
            { $group: { _id: { $toLower: "$city" }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        console.log('DEBUG: Aggregation City Result:', usersByCity);

        // Checking email domains.
        // Doing this in Node effectively handles the parsing.
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

        // Tracking growth over the last week.
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
// Sends a notification to a user. (POST /api/users/:id/notify)
const sendUserNotification = async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ success: false, message: 'Subject and message are required' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await sendNotificationEmail(user, subject, message);

        res.json({ success: true, message: 'Notification sent successfully' });
    } catch (err) {
        console.error('Notification Error:', err);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics,
    sendUserNotification
};
