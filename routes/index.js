const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const orderRoutes = require('./orderRoutes');
const profileRoutes = require('./profileRoutes');
const addressRoutes = require('./addressRoutes');
const wishlistRoutes = require('./wishlistRoutes');

// Public Health Check Endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User role endpoint
router.get('/user/role', authenticate, (req, res) => {
  res.json({ role: req.userRole });
});

// Mount modular sub-routers
router.use('/orders', orderRoutes);
router.use('/profile', profileRoutes);
router.use('/addresses', addressRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;
