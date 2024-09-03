const express = require("express");
const routes = express.Router();
const user = require("../controllers/user.controller");
routes.post("/register", user.register);
routes.post("/login", user.login);

module.exports = routes;
