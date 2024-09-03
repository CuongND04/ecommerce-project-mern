const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares/verifyToken");
const user = require("../controllers/user.controller");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/current", verifyAccessToken, user.getCurrent);

module.exports = router;
