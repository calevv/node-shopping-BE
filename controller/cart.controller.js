const { populate } = require("dotenv");
const Cart = require("../models/Cart");
const { model } = require("mongoose");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    let { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    let message = "";

    if (existItem) {
      existItem.qty += qty;
      message = "상품 수량이 업데이트되었습니다.";
    } else {
      cart.items.push({ productId, size, qty });
      message = "새로운 상품이 장바구니에 추가되었습니다.";
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: message,
      data: cart,
      cartItemQty: cart.items.length,
    });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};
cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    return res.status(200).json({
      status: "success",
      data: cart.items,
    });
  } catch (err) {
    return res.status(400).json({ status: "error", error: err.message });
  }
};

cartController.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));

    await cart.save();
    res.status(200).json({ status: 200, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
