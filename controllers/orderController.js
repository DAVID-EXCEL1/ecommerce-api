// controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderStatus,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Reduce stock for each item
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            userId: req.user._id,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderStatus,
        });

        const saved = await order.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user._id.toString() !== order.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    await order.save();
    res.json(order);
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};

