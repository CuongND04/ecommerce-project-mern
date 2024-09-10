const express = require("express");
const routes = express.Router();
const insert = require("../controllers/insertData.js");

routes.post("/product", insert.insertProduct);
routes.post("/category", insert.insertCategory);
module.exports = routes;
