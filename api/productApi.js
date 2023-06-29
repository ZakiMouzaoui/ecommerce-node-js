const express = require("express");

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductMultipleImages,
  resizeProductImages,
} = require("../services/productService");

const reviewsRoute = require("../api/reviewApi");

const router = express.Router();

const { protect, allowedTo } = require("./../services/authService");

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductMultipleImages,
    resizeProductImages,
    addProduct
  );
router
  .route("/:id")
  .get(getProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductMultipleImages,
    resizeProductImages,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProduct);

module.exports = router;
