const { VERIFY_MAIL } = require("../config");

const DOMAIN_MAIL_URL = (userId) => `${VERIFY_MAIL}/verify?accept=${userId}`;

const DOMAIN_MAIL_URL_FORGOT = (userId) =>
  `${VERIFY_MAIL}/forgot?accept=${userId}`;

const DOMAIN_CHANGE_MAIL = (userId, email) =>
  `${VERIFY_MAIL}/verify?accept=${userId}&mail=${email}`;
const ROLE = {
  ADMIN: 1,
};
const redisConfig = {
  port: 6380,
  host: "127.0.0.1",
  options: {},
};

const MODE_HIDE_POST = {
  PUBLIC: 0,
  FRIEND: 1,
  PRIVATE: 2,
};

module.exports = {
  DOMAIN_MAIL_URL,
  DOMAIN_MAIL_URL_FORGOT,
  DOMAIN_CHANGE_MAIL,
  ROLE,
  redisConfig,
  MODE_HIDE_POST,
};
