const myDataSource = require("./myDataSource");

const signUp = async (name, email, profileImageUrl, hashPassword, age) => {
  try {
    return await myDataSource.query(
      `INSERT INTO users (name,email,profile_image,password,age) VALUES (?,?,?,?,?);`,
      [name, email, profileImageUrl, hashPassword, age]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const signIn = async (email) => {
  try {
    const [userData] = await myDataSource.query(
      `SELECT * FROM users WHERE email=?`,
      [email]
    );
    return userData;
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  signUp,
  signIn,
};
