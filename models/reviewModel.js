const mongoose = require("mongoose");
const Product = require("./productModel");

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

reviewSchema.statics.calcAverageRatingsAndCount = async function (productId) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsCount
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: result[0].avgRating,
      ratingsCount: result[0].ratingsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      avgRating: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndCount(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndCount(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
