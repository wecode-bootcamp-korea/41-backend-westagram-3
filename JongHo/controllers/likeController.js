const likeService = require("../services/likeService");

const postLike = async (request, response) => {
  try {
    const check = await likeService.postLike(request);
    if (check === "create") {
      return response.status(201).json({ message: "likeCreated" });
    } else {
      return response.status(200).json({ message: "likeDeleted" });
    }
  } catch (err) {
    response.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { postLike };
