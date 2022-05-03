const { USER_DB, PASS_DB, DB_HOST } = require(".");

module.exports = {
  HOST: `${DB_HOST}`,
  USER: `${USER_DB}`,
  PASSWORD: `${PASS_DB}`,
  DB: "social_network",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
