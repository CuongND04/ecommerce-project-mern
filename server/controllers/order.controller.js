const Order = require("../models/order.model");
const User = require("../models/user.model");
const Coupon = require("../models/coupon.model");
const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => sum + el.product.price * el.quantity,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
        1000 || total;
    createData.total = total;
    createData.coupon = coupon;
  }
  const rs = await Order.create(createData);
  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Something went wrong",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing inputs");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status: status },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});
const getOrders = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    response: response ? response : "Something went wrong",
  });
});
module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getOrders,
};
