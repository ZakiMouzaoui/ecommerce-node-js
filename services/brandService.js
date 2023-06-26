const Brand = require("../models/brandModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp")
const asyncHandler = require('express-async-handler');

// UPLOAD SINGLE IMAGE
exports.uploadBrandImage = uploadSingleImage("image");

// IMAGE RROCESSING
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db 
   req.body.image = filename;

  next();
});


const getBrands = factory.getMany(Brand);

const getBrand = factory.getOne(Brand);

const addBrand = factory.addOne(Brand);

const updateBrand = factory.updateOne(Brand);

const deleteBrand = factory.deleteOne(Brand);

module.exports = {
  getBrands,
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
};
