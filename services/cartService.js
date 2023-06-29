const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");

const calcTotalCartPriceAndTotalItems = (cart) => {
  let totalPrice = 0;
  let totalItems = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
    totalItems += item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalCartItems = totalItems;
  cart.totalPriceAfterDiscount = undefined;
};

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });

  // IF CART DOES NOT EXIST
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          price: product.price,
          color,
        },
      ],
    });
  } else {
    // CHECK IF PRODUCT ALREADT IN CART
    const productIdx = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIdx === -1) {
      cart.cartItems.push({
        product: productId,
        price: product.price,
        color,
      });
    } else {
      // WE UPDATE THE PRODUCT QUANTITY
      cart.cartItems[productIdx].quantity += 1;
    }
  }
  calcTotalCartPriceAndTotalItems(cart);
  cart.save();
  res.status(201).json({
    status: "Success",
    message: "Product added to cart successfully",
    data: cart,
    totalItems: cart.totalCartItems,
  });
});

exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  const itemIdx = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIdx !== -1) {
    cart.cartItems[itemIdx].quantity = req.body.quantity;
    calcTotalCartPriceAndTotalItems(cart);
    cart.save();

    res.status(200).json({
      status: "Success",
      message: "Item updated successfully",
      data: cart.cartItems,
      totalItems: cart.totalCartItems,
      totalPrice: cart.totalCartPrice,
    });
  } else {
    return next(
      new ApiError(`No item found for this id: ${req.params.itemId}`, 404)
    );
  }
});

exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        cartItems: {
          _id: req.params.itemId,
        },
      },
    },
    {
      new: true,
    }
  );

  calcTotalCartPriceAndTotalItems(cart);
  cart.save();

  res.status(200).json({
    status: "Success",
    message: "Item deleted from cart successfully",
    data: cart.cartItems,
    totalItems: cart.totalCartItems,
    totalPrice: cart.totalCartPrice,
  });
});

exports.getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  calcTotalCartPriceAndTotalItems(cart);
  res.status(200).json({
    data: cart.cartItems,
    totalItems: cart.totalCartItems,
    totalCartPrice: cart.totalCartPrice,
  });
});

exports.clearUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      cartItems: [],
      totalcartItems: 0,
      totalCartPrice: 0,
      totalCartPriceAfterDiscount: 0,
    }
  );

  res.status(204).json({
    data: cart.cartItems,
    totalItems: [],
    totalPrice: 0,
  });
});
