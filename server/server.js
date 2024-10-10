const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8888;
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    method: ["POST", "GET", "PUT", "DELETE"],
    // thêm để nó lưu token vào cookie trình duyệt, giải quyết cors
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();

initRoutes(app);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
