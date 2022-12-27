const jwt = require("jsonwebtoken");
require("dotenv").config();
const validateToken = async (request, response, next) => {
  try {
    const accessToken = request.headers.authorization;
    const decode = jwt.verify(accessToken, process.env.SECRET_KEY);
    request.userId = decode;
    next();
  } catch (err) {
    console.error(err);
    response.status(401).json({ message: "Invalid Access Token" });
    next(err);
  }
};

module.exports = validateToken;
