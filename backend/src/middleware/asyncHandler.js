// Simple async wrapper to catch rejected promises and forward to next()
module.exports = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
