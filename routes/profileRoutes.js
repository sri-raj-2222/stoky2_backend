const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

// Secure all profile routes with auth middleware
router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

module.exports = router;
