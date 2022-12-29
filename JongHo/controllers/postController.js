const postService = require("../services/postService");

const create = async (request, response) => {
  try {
    await postService.create(request);
    return response.status(201).json({ message: "postCreated" });
  } catch (err) {
    console.error(err);
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const userPost = async (request, response) => {
  try {
    const results = await postService.userPost(request);
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const inquire = async (request, response) => {
  try {
    console.log(1);
    const results = await postService.inquire();
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const modify = async (request, response) => {
  try {
    const results = await postService.modify(request);
    return response.status(200).json({ data: results });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const del = async (request, response) => {
  try {
    await postService.del(request);
    return response.status(200).json({ message: "postingDeleted" });
  } catch (err) {
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

module.exports = {
  create,
  userPost,
  inquire,
  modify,
  del,
};
