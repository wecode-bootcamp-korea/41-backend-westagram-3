const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;
    const jwtVerify = jwt.verify(jwtToken, process.env.secretKey);

    req.userId = jwtVerify;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Access Token" });
    next(err);
  }
};

module.exports = {
  validateToken,
};
