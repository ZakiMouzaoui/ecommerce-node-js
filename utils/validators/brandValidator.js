const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const { check, body } = require("express-validator");

exports.createBrandValidator = [
  body("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  body("image").notEmpty().withMessage("Brand image is required"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  body("name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("image").optional(),
  validatorMiddleware,
];
