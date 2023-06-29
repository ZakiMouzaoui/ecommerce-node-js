const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("./../services/authService");
const { createUserValidator } = require("../utils/validators/userValidator");

router.route("/signup").post(createUserValidator, signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/ResetPassword/:token").put(resetPassword);

module.exports = router;
