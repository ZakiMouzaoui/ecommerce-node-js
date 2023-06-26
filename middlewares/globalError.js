const ApiError = require("../utils/apiError");

const globalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "CastError") {
      err = new ApiError(
        `Invalid ${err.path} for value: ${err.value}`,
        err.statusCode
      );
    } else if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];

      err = new ApiError(
        `${field} already exists for: ${value}`,
        err.statusCode
      );
    } else if (err.name === "ValidationError") {
      err = sendValidationErro(err);
    } else if (err.name === "JsonWebTokenError") {
      err = sendJWTError(err);
    } else if (err.name === "TokenExpiredError") {
      err = sendJWTExpireError(err);
    }
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      staus: "error",
      message: "Something went wrong. Please try again",
    });
  }
};

const sendValidationErro = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const msg = errors.join(". ");
  return new ApiError(msg, 400);
};

const sendJWTError = (err) => {
  return new ApiError("Invalid token. Please login again");
};

const sendJWTExpireError = (err) => {
  return new ApiError("Token expired. Please login again");
};

module.exports = globalError;
