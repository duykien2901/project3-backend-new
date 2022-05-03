const dotnet = require("dotenv");
dotnet.config();
const {
  PORT,
  DB_PORT,
  USER_DB,
  PASS_DB,
  USER_MAIL,
  USER_PASS,
  JWT_SECRET,
  VERIFY_MAIL,
  DB_HOST,
} = process.env;

module.exports = {
  PORT,
  DB_PORT,
  USER_DB,
  PASS_DB,
  USER_MAIL,
  USER_PASS,
  JWT_SECRET,
  VERIFY_MAIL,
  DB_HOST,
};
