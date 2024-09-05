const express = require("express");
const router = express.Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const blogCategory = require("../controllers/blogCategory.controller");

router.post("/", [verifyAccessToken, isAdmin], blogCategory.createCategory);
router.get("/", blogCategory.getCategories);
router.put("/:bcid", [verifyAccessToken, isAdmin], blogCategory.updateCategory);
router.delete(
  "/:bcid",
  [verifyAccessToken, isAdmin],
  blogCategory.deleteCategory
);

module.exports = router;
