const userService = require("../services/userService");

const signUp = async (request, response) => {
  try {
    const { name, email, profileImageUrl, password, age } = request.body;

    if (!name || !email || !password || !age) {
      return response.status(400).json({ message: "KEY_ERROR" });
    }

    await userService.signUp(name, email, profileImageUrl, password, age);
    return response.status(201).json({ message: "userCreated" });
  } catch (err) {
    console.log(err);
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

const signIn = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    const { result, jwtToken } = await userService.signIn(email, password);
    if (!result) {
      return response.status(401).json({ message: "Invalid User" });
    }
    return response.status(200).json({ accessToken: jwtToken });
  } catch (err) {
    console.log(err);
    return response
      .status(err.statusCode || 500)
      .json({ message: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
};
