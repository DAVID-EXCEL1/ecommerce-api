const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const router = express.Router();

router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        const totalSales = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Monthly Sales: Get sales per month
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Weekly Orders: Get count of orders for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // past 7 days including today

        const ordersThisWeek = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dayOfWeek: '$createdAt'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const ordersPerDay = new Array(7).fill(0);
        ordersThisWeek.forEach(item => {
            const dayIndex = (item._id + 5) % 7; // Convert MongoDB day (1=Sun) to JS day (0=Sun)
            ordersPerDay[dayIndex] = item.count;
        });

        const monthlySalesFormatted = new Array(12).fill(0);
        monthlySales.forEach(item => {
            monthlySalesFormatted[item._id - 1] = item.total;
        });

        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalSales: totalSales[0]?.total || 0,
            ordersThisWeek: ordersPerDay,
            monthlySales: monthlySalesFormatted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

module.exports = router;
