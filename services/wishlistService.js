const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist.",
    data: user.wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        wishlist: req.params.productId,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "Success",
    message: "Product removed from wishlist successfully",
    data: user.wishlist,
    results: user.wishlist.length,
  });
});

exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "Success",
    data: user.wishlist,
    results: user.wishlist.length,
  });
});
