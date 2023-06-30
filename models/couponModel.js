const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Coupon code is required"],
    },
    usageLimit: {
      type: Number,
      requierd: [true, "Coupon usage limit is required"],
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
      min: [0, "Coupon disount can not be negative"],
    },
    expireDate: {
      type: Date,
      required: [true, "Coupon exire date is required"],
    },
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
