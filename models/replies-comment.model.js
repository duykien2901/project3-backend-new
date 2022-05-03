module.exports = (sequelize, Sequelize) => {
  const repliesComment = sequelize.define(
    "replies",
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
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "comment_id",
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
      tableName: "replies_comment",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );
  repliesComment.associate = (models) => {
    const { users, posts, comments, reactions } = models;
    repliesComment.belongsTo(users, { foreignKey: "ownerId", as: "owner" });
    repliesComment.belongsTo(posts, { foreignKey: "postId" });
    repliesComment.belongsTo(comments, { foreignKey: "commentId" });
    repliesComment.hasMany(reactions, { foreignKey: "replyId" });
  };
  return repliesComment;
};
