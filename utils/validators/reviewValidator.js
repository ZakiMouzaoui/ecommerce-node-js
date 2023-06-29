const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  body("content").optional(),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),

  body("user").isMongoId().withMessage("Invalid id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid id format")

    .custom(async (_, { req }) => {
      // CHECK IF USER ALREADY MADE A REVIEW BEFORE
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject(
          new Error("You have already made a review for this product")
        );
      }
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(new Error("No review found with this id"));
      }

      if (review.user.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error("You are not allowed to edit this review")
        );
      }

      return true;
    }),
  body("content").optional(),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (!review) {
        return Promise.reject(new Error("No review found with this id"));
      }
      if (req.user.role === "user") {
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to delete this review")
          );
        }
      }

      return true;
    }),
  validatorMiddleware,
];
