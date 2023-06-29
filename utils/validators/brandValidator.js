const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const { check, body } = require("express-validator");

exports.updateBrandValidator = [
  check("name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("image").optional(),
  validatorMiddleware,
];
