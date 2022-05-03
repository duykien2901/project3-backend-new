module.exports = (sequelize, Sequelize) => {
  const comments = sequelize.define(
    "comments",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      images: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      mentions: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "owner_id",
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "post_id",
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
      tableName: "comments",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );
  comments.associate = (models) => {
    const { users, posts, replies, reactions } = models;
    comments.belongsTo(users, { foreignKey: "ownerId", as: "owner" });
    comments.belongsTo(posts, { foreignKey: "postId" });
    comments.hasMany(replies, { foreignKey: "commentId" });
    comments.hasMany(reactions, { foreignKey: "commentId" });
  };
  return comments;
};
