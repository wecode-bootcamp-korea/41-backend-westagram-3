const express = require("express");
const likeController = require("../controllers/likeController");

const router = express.Router();

const { validateToken } = require("../middlewares/auth.js");

// 8. 좋아요
router.post("/:postId", validateToken, likeController.likes);

module.exports = {
  router,
};
