const postDao = require("../models/postDao");

const createUserPost = async (request) => {
  const { title, content, imageUrl } = request.body;
  return await postDao.createUserPost(title, content, request.userId, imageUrl);
};
const inquireUserPost = async (request) => {
  const userId = request.userId;
  const results = await postDao.inquireUserPost(userId);
  return results;
};

const inquireAllPost = async () => {
  const results = await postDao.inquireAllPost();
  return results;
};
const modifyUserPost = async (request) => {
  const userId = request.userId;
  const postingId = request.params.postingId;
  const { content } = request.body;

  const check = await postDao.check(userId, postingId);
  if (!check) {
    const err = new Error("Not your post!");
    err.statusCode = 401;
    throw err;
  }

  const results = await postDao.modifyUserPost(content, postingId);
  return results;
};
const deleteUserPost = async (request) => {
  const postingId = request.params.postingId;
  const userId = request.userId;

  const check = await postDao.check(userId, postingId);
  if (!check) {
    const err = new Error("Not your post!");
    err.statusCode = 401;
    throw err;
  }

  return await postDao.deleteUserPost(postingId);
};

module.exports = {
  createUserPost,
  inquireUserPost,
  inquireAllPost,
  modifyUserPost,
  deleteUserPost,
};
