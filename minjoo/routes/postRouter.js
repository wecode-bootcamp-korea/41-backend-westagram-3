const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

const { validateToken } = require("../middlewares/auth.js");

// 3. 게시글 등록
// /posts/
router.post("/", validateToken, postController.createPost);

// 4. 전체 게시글 조회
router.get("/", postController.showAllPost);

// 5. 유저 게시글 조회
router.get("/user/:userId", postController.showUserPost);

// 6. 유저 게시글 수정
router.put("/user/:postId", validateToken, postController.modifyUserPost);

// 7. 게시글 삭제
router.delete("/:postId", postController.deletePost);

module.exports = {
  router,
};
