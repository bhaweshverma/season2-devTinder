const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_STRING + process.env.DATABASE_NAME
  );
};

module.exports = connectDB;
