const express = require("express");
const router = express.Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const productCategory = require("../controllers/productCategory.controller");

router.post("/", [verifyAccessToken, isAdmin], productCategory.createCategory);
router.get("/", productCategory.getCategories);
router.put(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  productCategory.updateCategory
);
router.delete(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  productCategory.deleteCategory
);

module.exports = router;
