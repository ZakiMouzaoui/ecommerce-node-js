const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");

const {
  addItemToCart,
  clearUserCart,
  getUserCart,
  updateItemQuantity,
  removeItemFromCart,
} = require("../services/cartService");

router.use(protect, allowedTo("user"));

router.route("/").get(getUserCart).post(addItemToCart).delete(clearUserCart);
router.route("/:itemId").put(updateItemQuantity).delete(removeItemFromCart);

module.exports = router;
