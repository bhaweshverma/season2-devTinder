const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // API Validation on sign-up user data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const newUserResponse = await newUser.save();

    const token = await newUserResponse.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    });
    res.json({ message: "User signedup successfully!", data: newUserResponse });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      // Generate JWT
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      res.json({ message: "Login successfull", data: user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", (_, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged-out successfully");
});

module.exports = router;
