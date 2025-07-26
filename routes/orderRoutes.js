const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');


// Order routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', protect, getOrderById);

module.exports = router;
