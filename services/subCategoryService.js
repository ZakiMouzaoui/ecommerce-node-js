const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")
const sharp = require("sharp")

// UPLOAD SINGLE IMAGE
exports.uploadSubCategoryImage = uploadSingleImage("image");

// IMAGE RROCESSING
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `subcategory-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/subcategories/${filename}`);

  // Save image into our db 
   req.body.image = filename;

  next();
});

exports.getSubCategories = asyncHandler(async (req, res) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 1;
  let skip = (page - 1) * limit;

  let filter = {};
  if (req.params.id) filter = { category: req.params.id };

  const subCategories = await subCategoryModel
    .find(filter)
    .skip(skip)
    .limit(limit);

  res.json({ results: subCategories.length, page: page, data: subCategories });
});

exports.getSubCategory = factory.getOne(subCategoryModel);

exports.addSubCategory = factory.addOne(subCategoryModel);

exports.updateSubCategory = factory.updateOne(subCategoryModel);

exports.deleteSubCategory = factory.deleteOne(subCategoryModel);