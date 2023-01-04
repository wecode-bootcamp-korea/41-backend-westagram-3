const { myDataSource } = require("./myDataSource");

const createUser = async (name, email, password, profileImage) => {
  try {
    return await myDataSource.query(
      `INSERT INTO users(
		    name,
		    email,
            profileImageUrl,
		    password
		) VALUES (?, ?, ?, ?);
		`,
      [name, email, password, profileImage]
    );
  } catch (err) {
    console.log(err);
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const getHashedPassword = async (email) => {
  try {
    // 1. 입력받은 email 과 매치되는 hashedPassword 를 DB 로부터 가져오기
    const [{ hashedPassword }] = await myDataSource.query(
      `SELECT password AS hashedPassword 
            FROM users 
            WHERE email = ?;
                `,
      [email]
    );
    return hashedPassword;
  } catch (err) {
    console.log(err);
    const error = new Error("GET_HASHED_PASSWORD_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

const getUserID = async (email) => {
  try {
    const [{ userId }] = await myDataSource.query(
      `
                SELECT id AS userId
                FROM users
                WHERE email = ?;
                `,
      [email]
    );
    return userId;
  } catch (err) {
    console.log(err);
    const error = new Error("GET_USER_ID_FAILED");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createUser,
  getHashedPassword,
  getUserID,
};
