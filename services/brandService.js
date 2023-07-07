const Brand = require("../models/brandModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

// UPLOAD SINGLE IMAGE
exports.uploadBrandImage = uploadSingleImage("image");

// IMAGE RROCESSING
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600, {
        fit: "fill",
      })
      .flatten({ background: "#ffffff" })
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
  }

  next();
});

exports.getBrands = factory.getMany(Brand);

exports.getBrand = factory.getOne(Brand);

exports.addBrand = factory.addOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
