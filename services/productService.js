const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlerFactory");

// GET ALL PRODUCTS
const getProducts = factory.getMany(Product);

// GET A SPECIFIC PRODUCT BY ID
const getProduct = factory.getOne(Product);

// ADD A PRODUCT
const addProduct = factory.addOne(Product);

// UPDATE A PRODUCT
const updateProduct = factory.updateOne(Product);

// DELETE A PRODUCT
const deleteProduct = factory.deleteOne(Product);

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
