const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const validateToken = require("../middleware/auth");

router.post("/:postId", validateToken, likeController.postLike);
module.exports = { router };
