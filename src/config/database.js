const mongoose = require("mongoose");

console.log(process.env.DB_CONNECTION_STRING + process.env.DATABASE_NAME);

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_STRING + process.env.DATABASE_NAME
  );
};

module.exports = connectDB;
