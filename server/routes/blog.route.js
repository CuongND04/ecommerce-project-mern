const router = require("express").Router();
const blog = require("../controllers/blog.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], blog.createBlog);
router.get("/", blog.getBlogs);
router.put("/like/:bid", verifyAccessToken, blog.likeBlog);
router.put("/dislike/:bid", verifyAccessToken, blog.dislikeBlog);

router.put(
  "/image/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  blog.uploadImageBlog
);
router.put("/:bid", [verifyAccessToken, isAdmin], blog.updateBlog);
router.get("/one/:bid", blog.getBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], blog.deleteBlog);
module.exports = router;
