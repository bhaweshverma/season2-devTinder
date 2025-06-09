const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 4,
      maxLength: 50,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email id " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("entered password is not strong");
        }
      },
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("invalid gender types");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1747659939~exp=1747663539~hmac=48bfdab780710bbb6935afc46db0f2c413ce90a0358a7ceecce0fb1a00b9f589&w=1380",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of me",
    },
  },
  {
    timestamps: true,
  }
);

// compound index
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.index({ email: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
