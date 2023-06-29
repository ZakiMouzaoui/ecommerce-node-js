const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("./handlerFactory");

const { v4: uuidv4 } = require("uuid");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const sharp = require("sharp");

// UPLOAD MULTIPLE IMAGE
exports.uploadProductMultipleImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// IMAGE RROCESSING
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for multiple images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          // Save image into our db
          req.body.images.push(imageName);
        })
      );
    }
  }

  next();
});

// GET ALL PRODUCTS
exports.getProducts = factory.getMany(Product);

// GET A SPECIFIC PRODUCT BY ID
exports.getProduct = factory.getOne(Product);

// ADD A PRODUCT
exports.addProduct = factory.addOne(Product);

// UPDATE A PRODUCT
exports.updateProduct = factory.updateOne(Product);

// DELETE A PRODUCT
exports.deleteProduct = factory.deleteOne(Product);
