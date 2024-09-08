const express = require("express");
const routes = express.Router();
const coupon = require("../controllers/coupon.controller");
const { isAdmin, verifyAccessToken } = require("../middlewares/verifyToken");

routes.post("/", [verifyAccessToken, isAdmin], coupon.createCoupon);
routes.put("/:cid", [verifyAccessToken, isAdmin], coupon.updateCoupon);
routes.get("/", coupon.getCoupons);
routes.delete("/:cid", [verifyAccessToken, isAdmin], coupon.deleteCoupon);
module.exports = routes;
