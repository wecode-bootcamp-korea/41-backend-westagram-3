const myDataSource = require("./myDataSource");

const check = async (userId, postId) => {
  try {
    const [check] = await myDataSource.query(
      `SELECT * FROM likes WHERE user_id=? AND post_id=?`,
      [userId, postId]
    );
    return check;
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const likeCreate = async (userId, postId) => {
  try {
    return await myDataSource.query(
      `INSERT INTO likes (user_id,post_id) VALUES (?, ?)`,
      [userId, postId]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const likeDelete = async (userId, postId) => {
  try {
    return await myDataSource.query(
      `DELETE FROM likes WHERE user_id=? AND post_id=?`,
      [userId, postId]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};
module.exports = { check, likeCreate, likeDelete };
