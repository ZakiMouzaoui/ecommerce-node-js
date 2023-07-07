const express = require("express");
const {
  getBrands,
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const { protect, allowedTo } = require("./../services/authService");

const {
  createBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    addBrand
  );
router
  .route("/:id")
  .get(getBrand)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateBrandValidator,
    uploadBrandImage,
    resizeImage,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrand);

module.exports = router;
