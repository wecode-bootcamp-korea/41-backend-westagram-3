const myDataSource = require("./myDataSource");

const check = async (userId, postingId) => {
  try {
    const [results] = await myDataSource.query(
      `SELECT 
            posts.id 
        from posts 
        INNER JOIN users 
        ON users.id=posts.user_id 
        WHERE users.id=? AND posts.id=?;
        `,
      [userId, postingId]
    );
    if (!results) {
      return false;
    }
    return true;
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const createUserPost = async (title, content, userId, imageUrl) => {
  try {
    return await myDataSource.query(
      `INSERT INTO posts (title,content,user_id,image_url) VALUES (?,?,?,?);`,
      [title, content, userId, imageUrl]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const inquireUserPost = async (userId) => {
  try {
    return await myDataSource.query(
      `SELECT
        u.id AS userId,
        u.profile_image AS userProfileImage,
        JSON_ARRAYAGG(
            JSON_OBJECT("postingId", p.id, "postingImageUrl", p.image_url, "postingContent", p.content)
                    ) AS postings
    FROM users u
    INNER JOIN posts p
    ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id;
    `,
      [userId]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const inquireAllPost = async () => {
  try {
    return await myDataSource.query(
      `SELECT 
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId, 
        posts.image_url as postingImageUrl,
        posts.content as postingContent 
        FROM users 
        INNER JOIN posts 
        ON posts.user_id=users.id;`
    );
  } catch (err) {
    const error = new Error("Error");
    error.statusCode = 500;
    throw error;
  }
};

const modifyUserPost = async (content, postingId) => {
  try {
    await myDataSource.query(
      `UPDATE 
        posts 
    SET content=? 
    WHERE posts.id=?;`,
      [content, postingId]
    );
    const [results] = await myDataSource.query(
      `SELECT 
            posts.user_id as userId,
            users.name as userName,
            posts.id as postingId,
            posts.title as postingTitle,
            posts.content as postingContent
        from posts 
        inner join users 
        on posts.user_id=users.id 
        where posts.id=?`,
      [postingId]
    );
    return results;
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const deleteUserPost = async (postingId) => {
  try {
    return await myDataSource.query(
      `DELETE 
            FROM posts
        WHERE posts.id=?;`,
      [postingId]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  check,
  createUserPost,
  inquireUserPost,
  inquireAllPost,
  modifyUserPost,
  deleteUserPost,
};
