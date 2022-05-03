const Queue = require("bee-queue");
const redis = require("./redis/redis");

module.exports = (name) => {
  return new Queue(name, {
    redis: redis,
    removeOnSuccess: true,
  });
};
