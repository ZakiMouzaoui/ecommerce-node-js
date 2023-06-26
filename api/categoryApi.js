const express = require("express");
const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const { protect, allowedTo } = require("./../services/authService");

const { applySlug } = require("../middlewares/apply_slug");

const router = express.Router();

const subCategoryApi = require("./subCategoryApi");

// router.use("/:id/subcategories", subCategoryApi);

router
  .route("/")
  .get(getCategories)
  .post(protect, allowedTo("admin", "manager"), applySlug, addCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, allowedTo("admin", "manager"), applySlug, updateCategory)
  .delete(protect, allowedTo("admin"), deleteCategory);

module.exports = router;
