const express = require("express");
const router = express.Router();
const product = require("../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], product.createProduct);
router.get("/", product.getListProducts);
router.put("/ratings", verifyAccessToken, product.ratings);

router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array("images", 10),
  product.uploadImagesProduct
);
router.put("/:pid", [verifyAccessToken, isAdmin], product.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], product.deleteProduct);
router.get("/:pid", product.getOneProduct);
module.exports = router;
