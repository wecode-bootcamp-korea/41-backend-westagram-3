const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const jsonwebtoken = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(jsonwebtoken, process.env.SECRET_KEY);

    req.userId = decode.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Access Token" });
    next(err);
  }
};

module.exports = {
  validateToken,
};
