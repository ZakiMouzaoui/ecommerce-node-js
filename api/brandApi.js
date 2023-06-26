const express = require("express");
const {
  getBrands,
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const { protect, allowedTo } = require("./../services/authService");

const { applySlug } = require("../middlewares/apply_slug");

const router = express.Router();

router
  .route("/")
  .get(protect, getBrands)
  .post(protect, allowedTo("admin", "manager"), applySlug, addBrand);
router
  .route("/:id")
  .get(protect, getBrand)
  .put(protect, allowedTo("admin", "manager"), applySlug, updateBrand)
  .delete(protect, allowedTo("admin"), deleteBrand);

module.exports = router;
