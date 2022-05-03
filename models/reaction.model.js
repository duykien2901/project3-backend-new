module.exports = (sequelize, Sequelize) => {
  const reactions = sequelize.define(
    "reactions",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      vote: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: "vote",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "user_id",
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "post_id",
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "comment_id",
      },
      replyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "reply_id",
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
    },
    {
      tableName: "reactions",
      timestamps: true,
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );
  reactions.associate = (models) => {
    const { users, posts, comments, replies } = models;
    reactions.belongsTo(users, { foreignKey: "userId", as: "owner" });
    reactions.belongsTo(posts, { foreignKey: "postId" });
    reactions.belongsTo(comments, { foreignKey: "commentId" });
    reactions.belongsTo(replies, { foreignKey: "replyId" });
  };
  return reactions;
};
