const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Get all products (Public)
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Get single product (Public)
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products); // ✅ Ensure you're returning the array directly
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Create a product (Admin only)

const createProduct = async (req, res) => {
    try {
        const { name, price, stock, imageUrl } = req.body;

        const newProduct = new Product({
            name,
            price,
            stock,
            imageUrl,
        });

        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};
// @desc    Update a product (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, imageUrl, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.imageUrl = imageUrl || product.imageUrl;
        product.stock = stock ?? product.stock;

        const updated = await product.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
