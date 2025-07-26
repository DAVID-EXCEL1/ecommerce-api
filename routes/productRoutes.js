const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');


router.get('/', getProducts); // public
router.get('/:id', getProductById); // public

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct); // admin
router.delete('/:id', protect, admin, deleteProduct); // admin

module.exports = router;



