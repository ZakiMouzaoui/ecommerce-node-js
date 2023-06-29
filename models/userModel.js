const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: [true, "Email already in use"],
      validate: [validator.isEmail, "Please enter a valid email"],
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: [6, "Too short user password"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: {
        values: ["admin", "manager", "user"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.ObjectId },
        city: String,
        street: String,
        details: String,
        postalCode: String,
        phone: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 8);
});

userSchema.methods.comparePasswordInDB = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  this.passwordResetVerified = false;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
