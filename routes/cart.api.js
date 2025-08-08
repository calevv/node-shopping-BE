const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const cartController = require("../controller/cart.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);
router.delete(
  "/:id",
  authController.authenticate,
  cartController.deleteCartItem
);
module.exports = router;
