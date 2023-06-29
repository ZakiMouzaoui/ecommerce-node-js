const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Min rating is 1"],
      max: [5, "Max rating is 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "A review must belong to a product"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
