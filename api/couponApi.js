const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  getCoupons,
  addCoupon,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require("../services/couponService");

const router = express.Router();

router.use(protect, allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(addCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
