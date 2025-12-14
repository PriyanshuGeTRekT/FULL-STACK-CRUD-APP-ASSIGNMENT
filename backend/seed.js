const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/db');

dotenv.config();

const users = [
    { name: 'John Doe', email: 'john@example.com', city: 'New York', state: 'NY' },
    { name: 'Jane Smith', email: 'jane@example.com', city: 'Los Angeles', state: 'CA' },
    { name: 'Alice Johnson', email: 'alice@example.com', city: 'Chicago', state: 'IL' },
    { name: 'Bob Brown', email: 'bob@example.com', city: 'New York', state: 'NY' },
    { name: 'Charlie Davis', email: 'charlie@example.com', city: 'Austin', state: 'TX' },
    { name: 'Eve Wilson', email: 'eve@example.com', city: 'San Jose', state: 'CA' },
    { name: 'Frank Miller', email: 'frank@example.com', city: 'Seattle', state: 'WA' },
    { name: 'Grace Taylor', email: 'grace@example.com', city: 'Boston', state: 'MA' },
    { name: 'Hank Thomas', email: 'hank@example.com', city: 'Houston', state: 'TX' },
    { name: 'Ivy Martinez', email: 'ivy@example.com', city: 'San Diego', state: 'CA' },
    { name: 'Jack White', email: 'jack@example.com', city: 'Phoenix', state: 'AZ' },
    { name: 'Kelly Green', email: 'kelly@example.com', city: 'Portland', state: 'OR' },
    { name: 'Liam Hall', email: 'liam@example.com', city: 'Miami', state: 'FL' },
    { name: 'Mia Young', email: 'mia@example.com', city: 'New York', state: 'NY' },
    { name: 'Noah King', email: 'noah@example.com', city: 'Atlanta', state: 'GA' },
    { name: 'Olivia Scott', email: 'olivia@example.com', city: 'Denver', state: 'CO' },
    { name: 'Paul Adams', email: 'paul@example.com', city: 'Dallas', state: 'TX' },
    { name: 'Quinn Baker', email: 'quinn@example.com', city: 'San Francisco', state: 'CA' },
    { name: 'Ryan Clark', email: 'ryan@example.com', city: 'Chicago', state: 'IL' },
    { name: 'Sara Lewis', email: 'sara@example.com', city: 'Los Angeles', state: 'CA' }
];

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        const logger = require('./src/utils/logger');
        logger.info('Data Destroyed...');

        await User.create(users);
        logger.info('Data Imported!');

        process.exit();
    } catch (err) {
        const logger = require('./src/utils/logger');
        logger.error(err);
        process.exit(1);
    }
};

seedData();
