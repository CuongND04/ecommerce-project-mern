const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8888;
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();

initRoutes(app);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
