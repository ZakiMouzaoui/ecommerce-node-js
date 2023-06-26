const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

const getSubCategories = asyncHandler(async (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 1;
  let skip = (page - 1) * limit;

  let filter = {};
  if (req.params.id) filter = { category: req.params.id };

  const subCategories = await subCategoryModel
    .find(filter)
    .skip(skip)
    .limit(limit);

  res.json({ results: subCategories.length, page: page, data: subCategories });
});

const getSubCategory = factory.getOne(subCategoryModel);

const addSubCategory = factory.addOne(subCategoryModel);

const updateSubCategory = factory.updateOne(subCategoryModel);

const deleteSubCategory = factory.deleteOne(subCategoryModel);

module.exports = {
  getSubCategories,
  getSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
