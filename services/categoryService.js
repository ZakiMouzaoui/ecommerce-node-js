const Category = require("../models/categoryModel");
const factory = require("./handlerFactory");
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware")
const sharp = require("sharp")

// UPLOAD SINGLE IMAGE
exports.uploadCategoryImage = uploadSingleImage("image");

// IMAGE RROCESSING
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  // Save image into our db 
   req.body.image = filename;

  next();
});

exports.getCategories = factory.getMany(Category);

exports.getCategory = factory.getOne(Category);

exports.addCategory = factory.addOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
