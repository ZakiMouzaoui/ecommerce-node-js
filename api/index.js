const categoryApi = require("./categoryApi");
const subCategoryApi = require("./subCategoryApi");
const brandApi = require("./brandApi");
const productApi = require("./productApi");
const userApi = require("./userApi");
const authApi = require("./authApi");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryApi);
  app.use("/api/v1/sub-categories", subCategoryApi);
  app.use("/api/v1/brands", brandApi);
  app.use("/api/v1/products", productApi);
  app.use("/api/v1/users", userApi);
  app.use("/api/v1/auth", authApi);
};

module.exports = mountRoutes;
