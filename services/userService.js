const User = require("../models/userModel");
const factory = require("./handlerFactory");

exports.getUsers = factory.getMany(User);

exports.getUser = factory.getOne(User);

exports.addUser = factory.addOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);