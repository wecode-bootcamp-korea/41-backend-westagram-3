const userService = require("../services/userService");

// 1. 회원가입
const signUp = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password || !profileImage) {
      const err = new Error("KEY_ERROR");
      err.statusCode = 400;
      throw err;
    }

    await userService.signUp(name, email, password, profileImage);
    return res.status(201).json({
      message: "SIGNUP_SUCCESS",
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// 2. 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("KEY_ERROR");
      err.statusCode = 400;
      throw err;
    }

    jwtToken = await userService.login(email, password);
    return res.status(201).json({ accessToken: jwtToken });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  login,
};
