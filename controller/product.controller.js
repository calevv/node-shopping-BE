const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, image, price, category, description, stock, status } =
      req.body;
    const product = new Product({
      sku,
      name,
      image,
      price,
      category,
      description,
      stock,
      status,
    });

    await product.save();
    return res.status(200).json({ status: "success", product });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;

    const cond = name
      ? {
          name: { $regex: name, $options: "i" },
        }
      : {};

    let query = Product.find(cond);

    const productList = await query.exec();

    return res.status(200).json({ status: "success", data: productList });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

module.exports = productController;
