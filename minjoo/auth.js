require("dotenv").config();
const jwt = require("jsonwebtoken");

const validateToken = async (req, res) => {
  try {
    const jsonwebtoken = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(jsonwebtoken, process.env.SECRET_KEY);

    // next();
    req.userId = decode.userId;
  } catch (err) {
    res.status(401).json({ message: "Invalid Access Token" });
    // next(err);
  }
};

module.exports = {
  validateToken,
};
