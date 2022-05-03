const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const genarateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", algorithm: "HS256" });
};

module.exports = { genarateToken };
