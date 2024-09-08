const express = require("express");
const routes = express.Router();
const order = require("../controllers/order.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

routes.post("/", [verifyAccessToken], order.createOrder);

module.exports = routes;
