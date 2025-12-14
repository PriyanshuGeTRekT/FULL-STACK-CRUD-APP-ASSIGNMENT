const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { userValidationRules, validate } = require('../middleware/validators');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics,
    sendUserNotification
} = require('../controllers/userController');

// Gotta put analytics first so it doesn't get mistaken for an ID.
router.get('/analytics/regions', asyncHandler(getAnalytics));

router.route('/')
    .get(asyncHandler(getUsers))
    .post(userValidationRules(), validate, asyncHandler(createUser));

router.route('/:id')
    .get(asyncHandler(getUser))
    .put(userValidationRules(), validate, asyncHandler(updateUser))
    .delete(asyncHandler(deleteUser));

router.post('/:id/notify', asyncHandler(sendUserNotification));

module.exports = router;
