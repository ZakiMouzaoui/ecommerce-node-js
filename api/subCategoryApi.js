const express = require("express");
const {
  getSubCategories,
  getSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");

const { protect, allowedTo } = require("./../services/authService");

const router = express.Router({ mergeParams: true });
const { applySlug } = require("../middlewares/apply_slug");

router
  .route("/")
  .get(getSubCategories)
  .post(protect, allowedTo("admin", "manager"), applySlug, addSubCategory);

router
  .route("/:id")
  .get(getSubCategory)
  .put(protect, allowedTo("admin", "manager"), applySlug, updateSubCategory)
  .delete(protect, allowedTo("admin"), deleteSubCategory);

module.exports = router;
