const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// 1. 회원가입
router.post("/signup", userController.signUp);

// 2. 로그인
router.post("/login", userController.login);

module.exports = {
  router,
};
