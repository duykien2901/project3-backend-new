module.exports = (sequelize, Sequelize) => {
  const posts = sequelize.define(
    "posts",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: Sequelize.INTEGER(4),
        allowNull: true,
        field: "category",
      },
      images: {
        type: Sequelize.STRING(2000),
        allowNull: true,
        field: "images",
      },
      views: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        field: "views",
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        field: "content",
      },
      feeling: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        field: "feeling",
      },
      mentions: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      modeHide: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "mode_hide",
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "owner_id",
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "group_id",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "posts",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  posts.associate = (models) => {
    const { users, groups, comments, reactions } = models;
    posts.belongsTo(users, {
      foreignKey: "ownerId",
      as: "owner",
    });
    posts.belongsTo(groups, { foreignKey: "groupId" });
    posts.hasMany(comments, { foreignKey: "postId" });
    posts.hasMany(reactions, { foreignKey: "postId" });
  };
  return posts;
};
