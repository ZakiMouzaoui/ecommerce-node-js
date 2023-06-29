const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../services/wishlistService");

router.use(protect, allowedTo("user"));
router.route("/").get(getWishlist).post(addToWishlist);

router.delete("/:productId", removeFromWishlist);

module.exports = router;
