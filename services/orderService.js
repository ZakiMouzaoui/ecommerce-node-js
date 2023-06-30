const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

const factory = require("../services/handlerFactory");

exports.createCachOrder = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return new ApiError(`No cart was found for this id: ${req.user._id}`);
  }

  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.cartItems,
    totalOrderPrice: shippingPrice + taxPrice + cart.totalCartPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    await cart.remove();
  }

  res.status(201).json({
    status: "Success",
    data: order,
  });
});

exports.createCardOrder = asyncHandler(async (req, res, next) => {});

exports.changeOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    data: order,
  });
});

exports.changeOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    data: order,
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = {
      user: req.user._id,
    };
  }
  next();
});

exports.getOrders = factory.getMany(Order);

exports.getOrder = factory.getOne(Order);

// EXPERIMENTAL ONLY
exports.deleteOrder = factory.deleteOne(Order);
