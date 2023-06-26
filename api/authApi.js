const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("./../services/authService");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/ResetPassword/:token").put(resetPassword);

module.exports = router;
