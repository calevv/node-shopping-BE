const Product = require("../models/Product");

const productController = {};

const PAGE_SIZE = 5;

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

    let responseData = { status: "success" };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);

      const totalItemNum = await Product.find(cond).countDocuments();

      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

      responseData.totalPageNum = totalPageNum;
    }

    const productList = await query.exec();
    responseData.data = productList;
    return res.status(200).json(responseData);
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

module.exports = productController;
