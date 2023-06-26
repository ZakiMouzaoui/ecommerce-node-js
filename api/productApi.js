const express = require("express");

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const router = express.Router();

const { protect, allowedTo } = require("./../services/authService");

router
  .route("/")
  .get(getProducts)
  .post(protect, allowedTo("admin", "manager"), addProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, allowedTo("admin", "manager"), updateProduct)
  .delete(protect, allowedTo("admin"), deleteProduct);

module.exports = router;
