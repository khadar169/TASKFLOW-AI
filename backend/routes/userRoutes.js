const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;
