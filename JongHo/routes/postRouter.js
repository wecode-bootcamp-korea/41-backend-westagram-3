const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validateToken = require("../middleware/auth");

//create a post using access token
router.post("/", validateToken, postController.createUserPost);

//inquire specific user's posts
router.get("/user", validateToken, postController.inquireUserPost);

//inquire posts
router.get("/", postController.inquireAllPost);

//modify a post
router.put("/:postingId", validateToken, postController.modifyUserPost);

//delete a post
router.delete("/:postingId", validateToken, postController.deleteUserPost);
module.exports = {
  router,
};
