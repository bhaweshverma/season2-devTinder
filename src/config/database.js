const mongoose = require("mongoose");
const DB_CONNECTION_STRING =
  "mongodb+srv://bhaweshverma7:FMzj1bJy7lfQNBqX@cluster-namastenodejs.l2qentf.mongodb.net/"; //"mongodb://localhost:27017/";
const DATABASE_NAME = "season2-devTinder";

const connectDB = async () => {
  await mongoose.connect(DB_CONNECTION_STRING + DATABASE_NAME);
};

module.exports = connectDB;
