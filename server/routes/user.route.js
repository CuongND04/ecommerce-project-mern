const express = require("express");
const routes = express.Router();
const user = require("../controllers/user.controller");
routes.post("/register", user.register);

module.exports = routes;
