const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signIn", userController.signIn);
router.post("/signUp", userController.signUp);

module.exports = {
  router,
};
