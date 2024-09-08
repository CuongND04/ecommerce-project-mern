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
  // Fields limiting : chỉ trả về những field được gọi
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Excute Query
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        counts,
        success: response ? true : false,
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

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  // hàm find trả về object ratings có _id
  const alreadyRating = ratingProduct?.ratings?.find(
    (item) => item.postedBy.toString() === _id
  );
  if (alreadyRating) {
    // update star and comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    // add star and comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }
  // sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, item) => sum + +item.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  console.log(req.file);
  return res.json("OKE");
});
module.exports = {
  createProduct,
  getOneProduct,
  getListProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProduct,
};
