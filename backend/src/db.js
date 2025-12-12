const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB (local or via URI from env)
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/junior-crud-db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
