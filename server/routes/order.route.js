const express = require("express");
const routes = express.Router();
const order = require("../controllers/order.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

routes.post("/", [verifyAccessToken], order.createOrder);
routes.get("/", [verifyAccessToken], order.getUserOrder);
routes.get("/admin", [verifyAccessToken, isAdmin], order.getOrders);
routes.put("/status/:oid", [verifyAccessToken, isAdmin], order.updateStatus);

module.exports = routes;
