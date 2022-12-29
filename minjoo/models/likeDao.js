const likes = async (userId, postId) => {
  try {
    // 현재 좋아요 상태 받아 옴
    const likeState = await myDataSource.query(
      `SELECT * From likes WHERE user_id = ? AND post_id = ?`,
      [userId, postId]
    );

    // 이미 좋아요 눌렀으면 취소한다
    if (likeState.length) {
      const likeId = likeState[0].id;
      await myDataSource.query(`DELETE FROM likes WHERE id = ?`, likeId);
      return false;
    }

    // 좋아요가 없으면 새로 누른다
    await myDataSource.query(
      `INSERT INTO likes(
      user_id,
      post_id
    ) VALUES (?, ?);
        `,
      [userId, postId]
    );
    return true;
  } catch (err) {
    console.log(err);
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  likes,
};
