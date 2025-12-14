const dotenv = require('dotenv');
const connectDB = require('./db');
const { initMailService } = require('./services/mailService');
const app = require('./app');
const logger = require('./utils/logger');

// Load env and start services
dotenv.config();

connectDB();
initMailService();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
