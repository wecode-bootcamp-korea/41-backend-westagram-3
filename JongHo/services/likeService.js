const likeDao = require("../models/likeDao");

const postLike = async (request) => {
  const userId = request.userId;
  const postId = request.params.postId;
  const check = await likeDao.check(userId, postId);
  if (!check) {
    await likeDao.likeCreate(userId, postId);
    return "create";
  } else {
    await likeDao.likeDelete(userId, postId);
    return "delete";
  }
};

module.exports = { postLike };
