const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

exports.createUserValidator = [
  check("name").notEmpty().withMessage("Name field is required"),
  check("email").notEmpty().withMessage("Email field is required"),
  check("password").notEmpty().withMessage("Password field is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password field is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword != req.body.password) {
        throw new Error("Passwords are not matching");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("Invalid phone number"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("Invalid phone number"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.updateAccountValidator = [
  body("name")
    .optional()
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email").optional().isEmail().withMessage("Invalid email address"),
  body("phone")
    .optional()
    .isMobilePhone(["ar-DZ"])
    .withMessage("Invalid phone number"),

  body("profileImg").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password field is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword != req.body.password) {
        throw new Error("Passwords are not matching");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password field is required")
    .custom((val, { req }) => {
      if (req.body.password.length < 8) {
        throw new Error("Password is too short");
      }
      return true;
    })
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("No user was found with this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updatePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("password")
    .notEmpty()
    .withMessage("Password field is required")
    .custom((val, { req }) => {
      if (req.body.password.length < 8) {
        throw new Error("Password is too short");
      }
      return true;
    })
    .custom(async (_, { req }) => {
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        req.user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password field is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword != req.body.password) {
        throw new Error("Passwords are not matching");
      }
      return true;
    }),

  validatorMiddleware,
];
