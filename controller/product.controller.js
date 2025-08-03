const Product = require('../models/Product');

const productController = {};

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, price, category, description, stock, status } = req.body;
        const product = new Product({ sku, name, size, image, price, category, description, stock, status });

        await product.save();
        return res.status(200).json({ status: 'success', product });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
};

module.exports = productController;
