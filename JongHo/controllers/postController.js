const postService = require("../services/postService");

const createUserPost = async (request, response) => {
  try {
    await postService.createUserPost(request);
    return response.status(201).json({ message: "postCreated" });
  } catch (err) {
    console.error(err);
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const inquireUserPost = async (request, response) => {
  try {
    const results = await postService.inquireUserPost(request);
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const inquireAllPost = async (request, response) => {
  try {
    console.log(1);
    const results = await postService.inquireAllPost();
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const modifyUserPost = async (request, response) => {
  try {
    const results = await postService.modifyUserPost(request);
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const deleteUserPost = async (request, response) => {
  try {
    await postService.deleteUserPost(request);
    return response.status(200).json({ message: "postingDeleted" });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

module.exports = {
  createUserPost,
  inquireUserPost,
  inquireAllPost,
  modifyUserPost,
  deleteUserPost,
};
