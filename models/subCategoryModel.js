const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      slug: {
        type: String,
        lowercase: true,
      },
      trim: true,
      minLength: [2, "Too short subcategory name"],
      maxLength: [32, "Too long subcategory name"],
      unique: [true, "Subcategory name must be unique"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to a category"],
    },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);
module.exports = subCategoryModel;
