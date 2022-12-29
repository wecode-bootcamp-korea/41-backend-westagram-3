const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validateToken = require("../middleware/auth");

//create a post using access token
router.post("/", validateToken, postController.create);

//inquire specific user's posts
router.get("/user", validateToken, postController.userPost);

//inquire posts
router.get("/", postController.inquire);

//modify a post
router.put("/:postingId", validateToken, postController.modify);

//delete a post
router.delete("/:postingId", validateToken, postController.del);
module.exports = {
  router,
};
