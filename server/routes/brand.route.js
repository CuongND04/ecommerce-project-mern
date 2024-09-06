const express = require("express");
const routes = express.Router();
const brand = require("../controllers/brand.controller");
const { isAdmin, verifyAccessToken } = require("../middlewares/verifyToken");

routes.post("/", [verifyAccessToken, isAdmin], brand.createBrand);
routes.get("/", brand.getBrands);
routes.put("/:bid", [verifyAccessToken, isAdmin], brand.updateBrand);
routes.delete("/:bid", [verifyAccessToken, isAdmin], brand.deleteBrand);

module.exports = routes;
