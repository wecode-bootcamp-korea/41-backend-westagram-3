const { myDataSource } = require("./myDataSource");

// 3. 게시글 등록
const createPost = async (title, content, userId, imageUrl) => {
  try {
    return await myDataSource.query(
      `INSERT INTO posts(
        title, 
        content, 
        userId,
        imageUrl
      ) VALUES (?, ?, ?, ?);
      `,
      [title, content, userId, imageUrl]
    );
  } catch (err) {
    console.log(err);
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

// 4. 전체 게시글 조회
const showAllPost = async () => {
  try {
    return await myDataSource.query(
      `SELECT 
      users.id AS userId, 
      users.profileImageUrl AS userProfileImage,
      posts.id AS postingId,
      posts.imageUrl AS postingImageUrl,
      posts.content AS postingContent
      FROM users
      INNER JOIN posts ON posts.userId = users.id`
    );
  } catch (err) {
    console.log(err);
    const error = new Error("DB_SELECT_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

// 5. 유저 게시글 조회
const showUserPost = async (userId) => {
  try {
    return await myDataSource.query(
      `SELECT
      users.id AS userId,
      users.profileImageUrl AS userProfileImage,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          "postingId", posts.id,
          "posingImageUrl", imageUrl,
          "postingContent", posts.content
        )
      ) AS postings
      FROM posts
      INNER JOIN users ON users.id = posts.userId
      WHERE users.id = ?
      GROUP BY users.id;`,
      [userId]
    );
  } catch (err) {
    console.log(err);
    const error = new Error("DB_SELECT_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

// 6. 게시글 수정
const modifyUserPost = async (content, userId, postId) => {
  try {
    // 게시글 수정
    await myDataSource.query(
      `UPDATE posts
      SET
      content = ?
			WHERE userId = ? AND id = ?
		`,
      [content, userId, postId]
    );

    // 수정된 게시글 내용 리턴
    return await myDataSource.query(
      `SELECT
        posts.userId AS userId,
        users.name AS userName,
        posts.id AS postingId,
        posts.title AS postingTitle,
        posts.content AS postingContent
      FROM posts
      INNER JOIN users ON users.id = posts.userId
      WHERE posts.id = ?`,
      [postId]
    );
  } catch (err) {
    console.log(err);
    const error = new Error("DB_SELECT_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

// 7. 게시글 삭제
const deletePost = async (postId) => {
  try {
    await myDataSource.query(
      `DELETE FROM posts
		WHERE posts.id = ${postId}
		`
    );
  } catch (err) {
    console.log(err);
    const error = new Error("DB_DELETE_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createPost,
  showAllPost,
  showUserPost,
  modifyUserPost,
  deletePost,
};
