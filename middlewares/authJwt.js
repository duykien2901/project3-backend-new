const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = function (app) {
  const verifyToken = async (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header.substring(7) || "";
    if (!header.startsWith("Bearer") || !token) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    jwt.verify(token, JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        if (Date.now() >= decode.exp * 1000) {
          return res.status(401).json({ message: "Token is expired" });
        }
        req.user = decode;
        next();
      }
    });
  };
  return { verifyToken };
};
