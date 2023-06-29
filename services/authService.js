const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const ApiError = require("./../utils/apiError");
const generateToken = require("./../utils/generateToken");
const sendEmail = require("./../utils/sendEmail");
const crypto = require("crypto");
const { sanitizeUser } = require("./../utils/sanitizeUser");

exports.signup = asyncHandler(async (req, res) => {
  const newUser = await User.create(req.body);

  const token = generateToken(newUser._id);

  res.status(201).json({
    status: "success",
    data: sanitizeUser(newUser),
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  // CHECK IF EMAIL AND PASSWORD EXISTS
  if (!email || !password) {
    return next(new ApiError("Email and password field are required", 400));
  }

  // CHECK IF USER EXISTS WITH EMAIL
  const user = await User.findOne({ email }).select("+password");

  // CHECK IF BOTH EMAIL AND PASSWORD ARE CORRECT
  if (!user || !(await user.comparePasswordInDB(password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  // GENERATE THE JWT TOKEN
  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    data: sanitizeUser(user),
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) GET TOKEN AND CHECK IF IT EXISTS
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Please login to access this route", 401));
  }

  // 2) CHECK IF TOKEN IS VALID
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) CHECK IF USER EXISTS WITH THIS TOKEN
  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(
      new ApiError(
        "The user that belongs to this token does no longer exist",
        401
      )
    );
  }

  // 4) CHECK IF PASSWORD WAS NOT CHANGED AFTER THE TOKEN WAS GENERATED
  if (user.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User has recently changed his password. please login again..",
          401
        )
      );
    }
  }

  delete user.password;

  // 5) AUTHENTICATE THE USER
  req.user = user;
  next();
});

exports.allowedTo = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not authorized to perform this operation", 403)
      );
    }
    next();
  });
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) GET THE USER BASED ON THE EMAIL
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("No user was found with the given email", 404));
  }

  // 2) GENERATE RANDOM RESET TOKEN
  const resetToken = await user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) SEND THE TOKEN TO THE EMAIL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `Hi ${user.name},\n We have received a password reset request.\n Please use the below link to reset your password.\n${resetUrl}\n This reset code is only valid for 10 minutes. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ApiError("There was an error in sending the email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // ENCRYPT THE RESET TOKEN
  let token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // CHECK IF THE USER EXISTS WITH THIS TOKEN & THE TOKEN HAS NOT EXPIRED
  let user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }

  // CHANGE THE USER PASSWORD
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // GENERATE THE JWT TOKEN
  token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
