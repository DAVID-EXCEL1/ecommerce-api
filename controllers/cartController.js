const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc Get current user's cart
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name price imageUrl');
    res.json(cart || { items: [] });
});

// @desc Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [{ productId, quantity }] });
    } else {
        const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
    }

    await cart.save();
    res.status(200).json(cart);
});

// @desc Update item quantity in cart
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) throw new Error('Item not in cart');

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
});

// @desc Remove item from cart
const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
});

// @desc Clear cart
const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};
