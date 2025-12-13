const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Try connecting to Mongo (local or env).
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/junior-crud-db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Make sure your local MongoDB is running and does not require authentication.');
        console.error('If it does, update backend/.env with: mongodb://user:pass@127.0.0.1:27017/junior-crud-db');
        // process.exit(1); // Keeping it alive even if DB fails.
    }
};

module.exports = connectDB;
