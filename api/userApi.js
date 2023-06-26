const express = require("express");
const {
  getUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../services/userService");

const { applySlug } = require("../middlewares/apply_slug");

// const { param, validationResult } = require("express-validator");

const router = express.Router();

router.route("/").get(getUsers).post(applySlug, addUser);
router.route("/:id").get(getUser).put(applySlug, updateUser).delete(deleteUser);

module.exports = router;
