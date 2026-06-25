const express = require('express');
const router = express.Router();
const { getOrders, getOrderById } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Secure all order routes with auth middleware
router.use(authenticate);

router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
