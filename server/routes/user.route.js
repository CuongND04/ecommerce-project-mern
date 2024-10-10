const express = require("express");
const router = express.Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const user = require("../controllers/user.controller");

router.post("/register", user.register);
// link trong email mặc định là method get nên phải để ở đây là get
router.get('/finalregister/:token', user.finalRegister)
router.post("/login", user.login);
router.get("/current", verifyAccessToken, user.getCurrent);
router.post("/refreshtoken", user.refreshAccessToken);
router.get("/logout", user.logout);
router.post("/forgotpassword", user.forgotPassword);
router.put("/resetpassword", user.resetPassword);

router.get("/", [verifyAccessToken, isAdmin], user.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], user.deleteUser);
router.put("/current", [verifyAccessToken], user.updateUser);
router.put("/address", [verifyAccessToken], user.updateUserAddress);
router.put("/cart", [verifyAccessToken], user.updateCart);
router.put("/:uid", [verifyAccessToken, isAdmin], user.updateUserByAdmin);

module.exports = router;
