const Order = require("../models/order.model");
const User = require("../models/user.model");
const Coupon = require("../models/coupon.model");
const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userCart = await User.findById(_id).select("cart");
  return res.json({
    success: userCart ? true : false,
    createdOrder: userCart ? userCart : "Cannot create new order",
  });
});
module.exports = {
  createOrder,
};
