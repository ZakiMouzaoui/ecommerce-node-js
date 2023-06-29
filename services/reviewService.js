const asyncHandler = require("express-async-handler");
const factory = require("../services/handlerFactory");
const Review = require("../models/reviewModel");

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (req.params) {
    req.body.product = req.params.productId;
  }
  if (req.user) {
    req.body.user = req.user._id;
  }
  next();
};

exports.getReviews = factory.getMany(Review);

exports.addReview = factory.addOne(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
