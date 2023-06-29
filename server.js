// IMPORTS FROM PACKAGES
const express = require("express");
const env = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");

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
app.use(cors());
app.options("*", cors());

app.use(compression());

app.use(express.json({ limit: "20kb" }));

app.use(express.static(path.join(__dirname, "uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again in 15 minutes",
});
// Apply the rate limiting middleware to all requests
app.use("/api/v1/auth", limiter);

// TO PREVENT HTTP POLLUTION
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "avgRating",
      "ratingsCount",
      "brand",
    ],
  })
);

// Add various HTTP headers
app.use(helmet());

// FORCE TO USE HTTPS
app.use(helmet.hsts());

// AGAINST CLICKJACKING
app.use(helmet.frameguard());

// XSS PROTECTION
app.use(helmet.xssFilter());

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
