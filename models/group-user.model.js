module.exports = function (sequelize, Sequelize) {
  const groupUsers = sequelize.define(
    "groupUsers",
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
        allowNull: true,
        field: "user_id",
      },
      groupId: {
        type: Sequelize.INTEGER(30),
        allowNull: true,
        field: "group_id",
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      tableName: "group_users",
      timestamps: true,
    }
  );

  // eslint-disable-next-line no-unused-vars
  groupUsers.associate = function (models) {
    const { users, groups } = models;
    groupUsers.belongsTo(users, { foreignKey: "userId" });
    groupUsers.belongsTo(groups, { foreignKey: "groupId" });
  };

  return groupUsers;
};
