const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const FeaturesApi = require("../utils/featuresApi");

exports.addOne = (Model) =>
  asyncHandler(async (req, res) => {
    let document = await Model.create(req.body);
    res.status(201).json(document);
  });

exports.getMany = (Model) =>
  asyncHandler(async (req, res) => {
    const documentsLength = await Model.countDocuments();
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const { mongooseQuery, paginationResult } = new FeaturesApi(
      Model.find(filter),
      req.query
    )
      .paginate(documentsLength)
      .search()
      .filter()
      .sort()
      .select();

    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    if (!req.filterObj) {
      req.filterObj = {};
    }

    req.filterObj._id = id;

    const document = await Model.findOne(req.filterObj);

    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`), 404);
    }
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`), 404);
    }
    document.remove();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    id = req.params.id;
    let document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }
    document.save();
    res.status(200).json(document);
  });
