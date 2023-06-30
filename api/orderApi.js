const express = require("express");

const router = express.Router();

const { protect, allowedTo } = require("../services/authService");
const {
  getOrder,
  getOrders,
  changeOrderToPaid,
  changeOrderToDelivered,
  createCachOrder,
  filterOrderForLoggedUser,
  deleteOrder,
} = require("../services/orderService");

router.use(protect);

router.post("/", allowedTo("user"), createCachOrder);
router.get("/", filterOrderForLoggedUser, getOrders);
router.get("/:id", filterOrderForLoggedUser, getOrder);
router.delete("/:id", deleteOrder);
router.put("/:id/pay", allowedTo("admin", "manager"), changeOrderToPaid);
router.put(
  "/:id/deliver",
  allowedTo("admin", "manager"),
  changeOrderToDelivered
);

module.exports = router;
