const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().map(e => e.msg).join(', '));
        err.statusCode = 400;
        return next(err);
    }
    next();
};

module.exports = { userValidationRules, validate };
