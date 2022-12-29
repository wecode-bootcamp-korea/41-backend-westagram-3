require("dotenv").config();
const userDao = require("../models/userDao");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (name, email, profileImageUrl, password, age) => {
  // password validation using REGEX
  const pwValidation = new RegExp(
    "^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})"
  );
  if (!pwValidation.test(password)) {
    const err = new Error("PASSWORD_IS_NOT_VALID");
    err.statusCode = 409;
    throw err;
  }
  const saltOrRounds = 12;
  const hashPassword = await bcrypt.hash(password, saltOrRounds);
  const signUp = await userDao.signUp(
    name,
    email,
    profileImageUrl,
    hashPassword,
    age
  );

  return signUp;
};
const signIn = async (email, password) => {
  const userData = await userDao.signIn(email);
  const result = await bcrypt.compare(password, userData.password);
  const jwtToken = jwt.sign(userData.id, process.env.SECRET_KEY);
  return { result, jwtToken };
};

module.exports = {
  signUp,
  signIn,
};
