const fs = require("fs");
const databaseConn = require("../../config/database");
const dotenv = require("dotenv");
const Product = require("../../models/productModel");
const products = JSON.parse(fs.readFileSync("./products.json"));

dotenv.config({ path: "../../config.env" });

databaseConn();

const insertData = async () => {
  await Product.create(products);
  console.log("Products created");
  process.exit();
};

const deleteData = async () => {
  await Product.deleteMany();
  console.log("Products deleted");
  process.exit();
};

if (process.argv[2] == "-i") {
  insertData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
