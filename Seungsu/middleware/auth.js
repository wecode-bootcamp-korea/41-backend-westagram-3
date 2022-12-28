const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.secretKey);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Access Token" });
    next(err);
  }
};

module.exports = validateToken;
