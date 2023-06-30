const Coupon = require("../models/couponModel");
const factory = require("./handlerFactory");

exports.getCoupons = factory.getMany(Coupon);

exports.getCoupon = factory.getOne(Coupon);

exports.addCoupon = factory.addOne(Coupon);

exports.updateCoupon = factory.updateOne(Coupon);

exports.deleteCoupon = factory.deleteOne(Coupon);
