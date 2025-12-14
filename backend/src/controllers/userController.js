const User = require('../models/User');
const { sendWelcomeEmail, sendNotificationEmail } = require('../services/mailService');

// Grabs everyone. (GET /api/users)
const getUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
};

// Finds just one person. (GET /api/users/:id)
const getUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    res.json({ success: true, data: user });
};

// Adds a new face. (POST /api/users)
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        // Try sending the welcome email, but don't crash if it bounces.
        try {
            await sendWelcomeEmail(user);
        } catch (emailErr) {
            const logger = require('../utils/logger');
            logger.error(`Email failed to send: ${emailErr}`);
        }

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        if (err.code === 11000) {
            const e = new Error('Email already exists');
            e.statusCode = 400;
            throw e;
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            const e = new Error(messages.join(', '));
            e.statusCode = 400;
            throw e;
        }
        throw err;
    }
};

// Updates their info. (PUT /api/users/:id)
const updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    res.json({ success: true, data: user });
};

// Removes them from the DB. (DELETE /api/users/:id)
const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    res.json({ success: true, data: {} });
};

// Crunches the numbers. (GET /api/analytics/regions)
const getAnalytics = async (req, res) => {
    // Grouping by State.
    const usersByState = await User.aggregate([
        { $group: { _id: { $toLower: "$state" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // Grouping by City.
    const usersByCity = await User.aggregate([
        { $group: { _id: { $toLower: "$city" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // Checking email domains using MongoDB aggregation for accuracy and performance.
    const usersByDomain = await User.aggregate([
        { $match: { email: { $exists: true, $type: 'string' } } },
        { $project: { domain: { $arrayElemAt: [{ $split: ['$email', '@'] }, 1] }, createdAt: 1 } },
        { $group: { _id: { $toLower: '$domain' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // Tracking growth over the last week using DB aggregation.
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    const growthAgg = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $project: { dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } },
        { $group: { _id: '$dateStr', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    const growthMap = {};
    growthAgg.forEach(g => { growthMap[g._id] = g.count; });
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }
    const userGrowth = last7Days.map(d => ({ _id: d, count: growthMap[d] || 0 }));

    res.json({
        success: true,
        data: {
            byState: usersByState,
            byCity: usersByCity,
            byDomain: usersByDomain,
            growth: userGrowth
        }
    });
};

// Sends a notification to a user. (POST /api/users/:id/notify)
const sendUserNotification = async (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) {
        const err = new Error('Subject and message are required');
        err.statusCode = 400;
        throw err;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    await sendNotificationEmail(user, subject, message);

    res.json({ success: true, message: 'Notification sent successfully' });
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
