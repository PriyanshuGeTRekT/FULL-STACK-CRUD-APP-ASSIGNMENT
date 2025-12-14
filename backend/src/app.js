const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');

// Load up environment config.
dotenv.config();

const app = express();

// Standard middleware setup.
app.use(cors());
app.use(express.json());

// Wire up our routes.
app.use('/api/users', userRoutes);

// Sanity check endpoint.
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Centralized error handler (last middleware)
app.use(errorHandler);

module.exports = app;
