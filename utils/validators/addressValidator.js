const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");

const { check, body } = require("express-validator");

exports.addAddressdValidator = [
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-DZ"])
    .withMessage("Invalid phone number"),
  validatorMiddleware,
];
