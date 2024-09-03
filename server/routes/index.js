const userRoute = require("./user.route");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
};
module.exports = initRoutes;
