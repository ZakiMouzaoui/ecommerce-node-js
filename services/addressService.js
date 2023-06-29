const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "Success",
    data: user.addresses,
    results: user.addresses.length,
  });
});

exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    data: user.addresses,
    message: "Address added successfully",
    results: user.addresses.length,
  });
});

exports.removeAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        addresses: {
          _id: req.params.addressId,
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    data: user.addresses,
    message: "Address removed successfully",
    results: user.addresses.length,
  });
});
