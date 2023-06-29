const User = require("../models/userModel");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const bcrypt = require("bcryptjs");
const { sanitizeUser } = require("../utils/sanitizeUser");
const generateToken = require("../utils/generateToken");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// USER
exports.updateLoggedUserData = asyncHandler(async (req, res) => {
  let user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res.status(200).json({
    data: sanitizeUser(user),
  });
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 8),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.User._id;
  next();
});

exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  let user = User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
    }
  );
  res.status(204).json({
    status: "Success",
  });
});

// ADMIN
exports.getUsers = factory.getMany(User);
exports.getUser = factory.getOne(User);
exports.addUser = factory.addOne(User);
exports.updateUser = factory.updateOne(User);

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 8),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    data: sanitizeUser(user),
  });
});
exports.deleteUser = factory.deleteOne(User);
