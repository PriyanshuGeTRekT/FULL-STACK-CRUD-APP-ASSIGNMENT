const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./routes/users');

// Load up environment config.
dotenv.config();

// Hook up the database.
connectDB();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
