const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
const likeRouter = require("./likeRouter");

router.use("/postLike", likeRouter.router);
router.use("/posts?", postRouter.router);
router.use(userRouter.router);

module.exports = router;
