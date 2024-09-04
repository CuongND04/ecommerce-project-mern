const express = require("express");
const router = express.Router();
const product = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], product.createProduct);
router.get("/", product.getListProducts);

router.put("/:pid", [verifyAccessToken, isAdmin], product.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], product.deleteProduct);
router.get("/:pid", product.getOneProduct);
module.exports = router;
