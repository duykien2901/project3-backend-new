const { reverse } = require("lodash");
const {
  COMMENT_LIMIT,
  COMMENT_OFFSET,
} = require("../../constants/default.constant");
const db = require("../../models");
const validateResponse = require("../../utils/changeResponse.hook");

module.exports = () => {
  const commentsModel = db.comments;
  const userModel = db.users;
  const ReactionModel = db.reactions;
  const { sequelize } = db;

  const subCommentQuery = () => {
    return [
      [
        sequelize.literal(`(
                SELECT COUNT(*)
                FROM replies_comment as replies
                WHERE
                  comments.id = replies.comment_id
                  and replies.deletedAt IS NULL
            )`),
        "totalReplies",
      ],
    ];
  };

  const getCommentByPage = async (req, res) => {
    const {
      limit = COMMENT_LIMIT,
      offset = COMMENT_OFFSET,
      postId = 0,
    } = req.query;
    const { user } = req;
    try {
      let comments = await commentsModel.findAll({
        where: { postId: +postId },
        limit: +limit,
        offset: +offset,
        include: [
          {
            model: userModel,
            as: "owner",
            attributes: ["name", "email", "id", "profileImage", "userId"],
          },
          {
            model: ReactionModel,
            where: {
              userId: user.id,
            },
            required: false,
            attributes: ["vote"],
          },
        ],
        attributes: {
          include: subCommentQuery(),
        },

        order: [["createdAt", "DESC"]],
      });

      comments = await Promise.all(
        comments.map((comment) => validateResponse(comment))
      );

      comments = reverse(comments);
      return res.json({ comments });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  const createComment = async (req, res) => {
    try {
      let comment = await commentsModel.create({ ...req.body });
      comment.dataValues.owner = await userModel.findOne({
        where: {
          id: comment.ownerId,
        },
        attributes: {
          exclude: ["password", "active", "createdAt", "updatedAt"],
        },
      });
      comment = await validateResponse(comment);

      return res.json({ comment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const editComment = async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    try {
      await commentsModel.update({ ...req.body }, { where: { id } });
      let comment = await commentsModel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: userModel,
            as: "owner",
            attributes: ["name", "email", "id", "profileImage", "userId"],
          },
          {
            model: ReactionModel,
            where: {
              userId: user.id,
            },
            required: false,
            attributes: ["vote"],
          },
        ],
        attributes: {
          include: subCommentQuery(),
        },
      });
      comment = await validateResponse(comment);

      return res.json({ comment });
    } catch (err) {
      return res.status(404).json({ message: error.message });
    }
  };

  const deleteCommentById = async (req, res) => {
    const { id } = req.params;
    const comment = commentsModel.findByPk(+id);
    if (!comment) {
      throw new Error("comment not found");
    }
    try {
      await commentsModel.destroy({ where: { id } });
      return res.json({ message: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  return { getCommentByPage, createComment, editComment, deleteCommentById };
};
