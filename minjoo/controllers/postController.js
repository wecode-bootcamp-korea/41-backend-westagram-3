const postService = require("../services/postService");

// 3. 게시글 등록
const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    if (!title || !content || !imageUrl) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    await postService.createPost(title, content, req.userId, imageUrl);
    return res.status(201).json({
      message: "CREATE_POST_SUCCESS",
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// 4. 전체 게시글 조회
const showAllPost = async (req, res) => {
  try {
    postList = await postService.showAllPost();
    return res.status(201).json({ data: postList });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// 5. 유저 게시글 조회
const showUserPost = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    postList = await postService.showUserPost(userId);
    return res.status(201).json({ data: postList });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// 6. 유저 게시글 수정
const modifyUserPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || !postId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    // [postingContent, userId, id]
    modifiedPost = await postService.modifyUserPost(content, userId, postId);
    return res.status(201).json({ data: modifiedPost });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// 7. 게시글 삭제
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    await postService.deletePost(postId);
    return res.status(200).json({
      message: "DELETE_POST_SUCCESS",
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  showAllPost,
  showUserPost,
  modifyUserPost,
  deletePost,
};
