const express = require("express");

const router = express.Router({ mergeParams: true });

const { protect, allowedTo } = require("../services/authService");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  addReview,
  updateReview,
  getReview,
  deleteReview,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

router
  .route("/")
  .get(getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    addReview
  );
router
  .route("/:id")
  .get(allowedTo("user"), getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
