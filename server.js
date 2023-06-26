// IMPORTS FROM PACKAGES
const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");

// IMPORTS FROM LOCAL FILES
const databaseConn = require("./config/database");

const globalError = require("./middlewares/globalError");
const ApiError = require("./utils/apiError");

// ROUTES
const mountRoutes = require("./api");

// ENV CONFIG
env.config({ path: "config.env" });
const port = process.env.PORT;

// DATABASE
databaseConn();

// UNCAUGHT EXCEPTION
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

// EXPRESS APP
const app = express();

// MIDDLEWARES
app.use(express.json());

// MOUNT ROUTES
mountRoutes(app);

// NOT FOUND ROUTE
app.all("*", (req, res, next) => {
  const err = new ApiError(`Can't find these route: ${req.originalUrl}`, 404);
  next(err);
});

// GLOBAL ERROR HANDLING MIDDLEWARE FOR EXPRESS
app.use(globalError);

// CONNECTING TO SERVER
const server = app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

// UNHANDLED REJECTION
process.on("unhandledRejection", (err) => {
  server.close(() => {
    console.log(err);
    process.exit(1);
  });
});
