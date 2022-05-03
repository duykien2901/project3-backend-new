const redisClient = require("redis");
const { redisConfig } = require("../../constants/commom.constant");

const redis = redisClient.createClient(
  redisConfig.host || 6379,
  redisConfig.host || "127.0.0.1",
  redisConfig.options || {}
);
redis.on("error", (error) => {
  console.error("ERROR redis ====> ", error);
});

module.exports = redis;
