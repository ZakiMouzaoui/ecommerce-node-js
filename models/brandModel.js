const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name already exists"],
      trim: true,
      minLength: [2, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      //required: [true, "Brand image is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
