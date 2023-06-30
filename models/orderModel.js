const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.ObjectId },
        quantity: Number,
        price: Number,
        color: String,
      },
    ],
    taxPrice: Number,
    shippingAddress: {
      city: String,
      postalCode: String,
      street: String,
      details: String,
      phone: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    totalOrderPrice: Number,
    paymentMethod: {
      type: String,
      enum: {
        values: ["cach", "card"],
        message: "{VALUE} is not supported",
        default: "cach",
      },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({
    path: "orderItems.product",
    select: "names imageCover ",
  });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
