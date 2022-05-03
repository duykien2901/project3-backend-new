module.exports = (sequelize, Sequelize) => {
  const groups = sequelize.define(
    "groups",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        field: "name",
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "description",
      },
      accessLevel: {
        type: Sequelize.INTEGER,
        field: "access_level",
      },
      permission: {
        type: Sequelize.INTEGER,
        field: "permission",
      },
      images: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "images",
      },
      modeHide: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "mode_hide",
      },
    },
    {
      tableName: "groups",
      timestamps: false,
    }
  );

  groups.associate = function (models) {
    const { groupUsers, posts } = models;
    groups.hasMany(groupUsers, { foreignKey: "groupId" });
    groups.hasMany(posts, { foreignKey: "groupId" });
  };

  return groups;
};
