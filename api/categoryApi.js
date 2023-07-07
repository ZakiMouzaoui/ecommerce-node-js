const express = require("express");
const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const { protect, allowedTo } = require("./../services/authService");

const router = express.Router();

const subCategoryApi = require("./subCategoryApi");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");

// router.use("/:id/subcategories", subCategoryApi);
router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    addCategory
  );
router
  .route("/:id")
  .get(getCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategory);

module.exports = router;
