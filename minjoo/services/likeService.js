const likeDao = require("../models/likeDao");

// 8. 좋아요
const likes = async (userId, postId) => {
  const result = await likeDao.likes(userId, postId);

  return result;
};

module.exports = {
  likes,
};
