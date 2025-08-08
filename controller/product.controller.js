const Product = require("../models/Product");

const productController = {};

const PAGE_SIZE = 5;

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, image, price, category, description, stock, status } =
      req.body;

    if (!image) {
      return res.status(400).json({
        status: "error",
        error: `상품 이미지가 비어있어요.`,
      });
    }

    // SKU 중복 체크
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        error: `상품번호 ${sku}는 이미 존재합니다.`,
      });
    }

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
          isDeleted: false,
        }
      : { isDeleted: false };

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

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, image, price, category, description, stock, status } =
      req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, image, price, category, description, stock, status },
      { new: true }
    );

    if (!product) throw new Error("item doesn't exist");

    return res.status(200).json({ status: "success", data: product });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true }
    );
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("No item found");
    res.status(200).json({ status: "success", data: product });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

module.exports = productController;
