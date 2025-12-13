const express = require('express');
const router = express.Router();
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
router.get('/analytics/regions', getAnalytics);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.post('/:id/notify', sendUserNotification);

module.exports = router;
