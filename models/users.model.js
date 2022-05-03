const { DataTypes } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  // const sequelizeClient = app.get("sequelizeClient");
  const users = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      profileImage: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: null,
        field: "profile_image",
      },
      userId: {
        type: Sequelize.STRING(30),
        allowNull: true,
        field: "user_id",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    const { groupUsers, posts, comments, reactions, userFollows } = models;
    users.hasMany(groupUsers, { foreignKey: "userId" });
    users.hasMany(posts, { foreignKey: "ownerId" });
    users.hasMany(comments, { foreignKey: "ownerId" });
    users.hasMany(reactions, { foreignKey: "userId" });
    users.hasMany(userFollows, { foreignKey: "userId", as: "follower" });
    users.hasMany(userFollows, { foreignKey: "followId", as: "following" });
  };
  return users;
};
