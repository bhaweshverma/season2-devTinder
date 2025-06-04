const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateForgotPasswordData,
} = require("../utils/validation");
const User = require("../models/user");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({ message: "profile fetched successfully", data: user });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid field update");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    const updatedUser = await loggedInUser.save();

    res.json({
      message: "Profile updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.patch("/profile/password", async (req, res) => {
  try {
    // email verification is done, write only change password logic
    // sanitize the data
    if (!validateForgotPasswordData(req)) {
      throw new Error("enter valid credentails");
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    user["password"] = hashedPassword;

    const updatedUser = await user.save();
    res.json({
      message: "Password changed successfully!",
      data: {
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = router;
