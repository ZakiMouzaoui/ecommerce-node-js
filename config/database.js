const mongoose = require("mongoose");

const databaseConn = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Database onnected");
  });
};

module.exports = databaseConn;
