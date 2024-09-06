const userRoute = require("./user.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./productCategory.route");
const blogCategoryRoute = require("./blogCategory.route");
const blogRoute = require("./blog.route");
const { notFound, errHandler } = require("../middlewares/errHandler");
const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/product-category", productCategoryRoute);
  app.use("/api/blog-category", blogCategoryRoute);
  app.use("/api/blog", blogRoute);

  app.use(notFound);
  app.use(errHandler);
};
module.exports = initRoutes;
