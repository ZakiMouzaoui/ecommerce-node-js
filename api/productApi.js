const express = require("express");

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductMultipleImages,
  resizeProductImages
} = require("../services/productService");

const router = express.Router();

const { protect, allowedTo } = require("./../services/authService");

router
  .route("/")
  .get(getProducts)
  .post(protect, allowedTo("admin", "manager"), uploadProductMultipleImages, resizeProductImages, addProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, allowedTo("admin", "manager"), uploadProductMultipleImages, resizeProductImages, updateProduct)
  .delete(protect, allowedTo("admin"), deleteProduct);

module.exports = router;
