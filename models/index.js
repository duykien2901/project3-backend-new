const Sequelize = require("sequelize");
const { DB_PORT } = require("../config");
const dbConfig = require("../config/db.config");
console.log(dbConfig);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: DB_PORT,
  operatorsAliases: 0,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};

db.users = require("./users.model")(sequelize, Sequelize);
db.groupUsers = require("./group-user.model")(sequelize, Sequelize);
db.groups = require("./groups.model")(sequelize, Sequelize);
db.posts = require("./posts.model")(sequelize, Sequelize);
db.comments = require("./comments.model")(sequelize, Sequelize);
db.replies = require("./replies-comment.model")(sequelize, Sequelize);
db.reactions = require("./reaction.model")(sequelize, Sequelize);
db.userFollows = require("./user_follow.model")(sequelize, Sequelize);

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;
