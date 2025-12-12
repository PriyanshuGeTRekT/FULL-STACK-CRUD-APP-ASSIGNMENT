const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics
} = require('../controllers/userController');

// Analytics must be before /:id to not be matched as an ID
router.get('/analytics/regions', getAnalytics);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
