const Category = require("../models/categoryModel");
const factory = require("./handlerFactory");

exports.getCategories = factory.getMany(Category);

exports.getCategory = factory.getOne(Category);

exports.addCategory = factory.addOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
