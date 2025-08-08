const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
      },
    ],
  },
  { timestamps: true }
);
cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.createdAt;
  return obj;
};
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
