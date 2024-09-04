const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length == 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});
const getOneProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});

// Filtering, sorting & pagination
const getListProducts = asyncHandler(async (req, res) => {
  // không gán trực tiếp vì muốn tạo một bản sao không ảnh hưởng đến bản gốc
  const queries = { ...req.query };
  // tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // format các operators đúng theo đúng cú pháp của mongoose
  /*
    // price[gt] : 3000 === price : { gt : 3000}
    req.query { price: { gt: '5000' }, title: 'điều' }
    formatedQueries { price: { '$gt': '5000' }, title: 'điều' }
   */
  let queryString = JSON.stringify(queries);
  // thêm "$" trước các operator
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (matchEl) => `$${matchEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  // chỗ này không thêm await vì chờ thêm sort, rồi xuống dưới then mới xử lí khi nó trả về response
  let queryCommand = Product.find(formatedQueries);
  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Excute Query
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : "Cannot get products",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  // Nếu nó thay đổi title thì phải update lại slug
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});
module.exports = {
  createProduct,
  getOneProduct,
  getListProducts,
  updateProduct,
  deleteProduct,
};
