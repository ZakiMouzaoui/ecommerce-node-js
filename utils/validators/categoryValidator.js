const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const { check, body } = require("express-validator");

exports.createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  body("image").notEmpty().withMessage("Category image is required"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  body("name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("image").optional(),
  validatorMiddleware,
];
