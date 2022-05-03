module.exports = (sequelize, Sequelize) => {
  const user_follows = sequelize.define(
    "user_follows",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      followId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "follow_id",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "updated_at",
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user_follows",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  user_follows.associate = (models) => {
    const { users } = models;
    user_follows.belongsTo(users, { foreignKey: "userId", as: "follower" });
    user_follows.belongsTo(users, { foreignKey: "followId", as: "following" });
  };

  return user_follows;
};
