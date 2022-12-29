const postDao = require("../models/postDao");

const create = async (request) => {
  const { title, content, imageUrl } = request.body;
  return await postDao.create(title, content, request.userId, imageUrl);
};
const userPost = async (request) => {
  const userId = request.userId;
  const results = await postDao.userPost(userId);
  return results;
};

const inquire = async () => {
  const results = await postDao.inquire();
  return results;
};
const modify = async (request) => {
  const userId = request.userId;
  const postingId = request.params.postingId;
  const { content } = request.body;

  const check = await postDao.check(userId, postingId);
  if (!check) {
    const err = new Error("Not your post!");
    err.statusCode = 401;
    throw err;
  }

  const results = await postDao.modify(content, postingId);
  return results;
};
const del = async (request) => {
  const postingId = request.params.postingId;
  const userId = request.userId;

  const check = await postDao.check(userId, postingId);
  if (!check) {
    const err = new Error("Not your post!");
    err.statusCode = 401;
    throw err;
  }

  return await postDao.del(postingId);
};

module.exports = {
  create,
  userPost,
  inquire,
  modify,
  del,
};
