const BlogCategory = require("../models/blogCategory.model");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await BlogCategory.create(req.body);
  return res.json({
    success: response ? true : false,
    createdCategory: response ? response : "Cannot create new blog categorys",
  });
});
const getCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select("title");
  return res.json({
    success: response ? true : false,
    blogCategories: response ? response : "Cannot get list of category blogs",
  });
});
const updateCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update category",
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bcid);
  return res.json({
    success: response ? true : false,
    deletedCategory: response ? response : "Cannot delete category",
  });
});
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
