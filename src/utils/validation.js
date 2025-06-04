const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter valid name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter valid and strong password");
  }
};

const validateEditProfileData = (req) => {
  const data = req.body;
  const ALLOWED_VALUES_TO_EDIT = [
    "photoUrl",
    "about",
    "skills",
    "age",
    "firstName",
    "lastName",
    "gender",
  ];
  const isAllFieldsValid = Object.keys(data).every((val) =>
    ALLOWED_VALUES_TO_EDIT.includes(val)
  );
  return isAllFieldsValid;
};

const validateForgotPasswordData = (req) => {
  const data = req.body;

  const ALLOWED_VALUES_TO_PASSWORD = ["email", "password"];

  const isAllFieldsValid = Object.keys(data).every((val) =>
    ALLOWED_VALUES_TO_PASSWORD.includes(val)
  );

  return isAllFieldsValid;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateForgotPasswordData,
};
