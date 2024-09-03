const express = require("express");
const router = express.Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const user = require("../controllers/user.controller");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/current", verifyAccessToken, user.getCurrent);
router.post("/refreshtoken", user.refreshAccessToken);
router.get("/logout", user.logout);
router.get("/forgotpassword", user.forgotPassword);
router.put("/resetpassword", user.resetPassword);

router.get("/", [verifyAccessToken, isAdmin], user.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], user.deleteUser);
router.put("/current", [verifyAccessToken], user.updateUser);
router.put("/:uid", [verifyAccessToken, isAdmin], user.updateUserByAdmin);

module.exports = router;
