// Centralized error handling middleware
// Export a function with signature (err, req, res, next)

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Default to 500
    const statusCode = err.statusCode || 500;
    logger.error(`ERROR HANDLER: ${err.message || err}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error'
    });
};

module.exports = errorHandler;
