// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        totalAmount: { type: Number, required: true },
        shippingAddress: {
            street: String,
            city: String,
            postalCode: String,
            country: String,
        },
        paymentMethod: {
            type: String,
            enum: ['Credit Card', 'PayPal', 'Cash on Delivery'],
            default: 'Cash on Delivery',
        },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
