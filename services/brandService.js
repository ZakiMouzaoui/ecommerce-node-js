const Brand = require("../models/brandModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("./../middlewares/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = reqiore();

// UPLOAD SINGLE IMAGE
exports.uploadBrandImage = uploadSingleImage("image");

// IMAGE RROCESSING

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
