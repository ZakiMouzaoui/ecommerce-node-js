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
const {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductMultipleImages,
    resizeProductImages,
    createProductValidator,
    addProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductMultipleImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
