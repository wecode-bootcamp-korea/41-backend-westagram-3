const likeService = require("../services/likeService");

// 8. 좋아요
const likes = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    if (!postId) {
      const err = new Error("KEY_ERROR");
      err.statusCode = 400;
      throw err;
    }

    result = await likeService.likes(userId, postId);
    // 좋아요 성공
    if (result) return res.status(201).json({ message: "LIKE_SUCCESS" });
    // 좋아요 취소 성공
    return res.status(201).json({ message: "LIKE_CANCEL_SUCCESS" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  likes,
};
