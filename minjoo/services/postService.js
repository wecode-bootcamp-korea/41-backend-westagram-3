require("dotenv").config();

const postDao = require("../models/postDao");

// 3. 토큰 확인 & 게시글 등록
const createPost = async (title, content, userId, imageUrl) => {
  await postDao.createPost(title, content, userId, imageUrl);
};

// 4. 전체 게시글 조회
const showAllPost = async () => {
  return await postDao.showAllPost();
};

// 5. 유저 게시글 조회
const showUserPost = async (userId) => {
  return await postDao.showUserPost(userId);
};

// 6. 게시글 수정
const modifyUserPost = async (content, userId, postId) => {
  return await postDao.modifyUserPost(content, userId, postId);
};

// 7. 게시글 삭제
const deletePost = async (postId) => {
  await postDao.deletePost(postId);
};

module.exports = {
  createPost,
  showAllPost,
  showUserPost,
  modifyUserPost,
  deletePost,
};
