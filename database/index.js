const mongoose = require("mongoose");

const db = process.env.NODE_ENV === "test" ? process.env.testdb : process.env.db;

module.exports = function (logger) {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
