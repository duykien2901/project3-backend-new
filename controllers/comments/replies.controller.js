const { reverse } = require("lodash");
const { LIMIT, OFFSET } = require("../../constants/default.constant");
const db = require("../../models");
const validateResponse = require("../../utils/changeResponse.hook");

module.exports = () => {
  const RepliesModel = db.replies;
  const CommentModel = db.comments;
  const UserModel = db.users;
  const ReactionModel = db.reactions;

  const checkCommentId = async (commentId) => {
    const comment = await CommentModel.findByPk(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
  };

  const getAllReplies = async (req, res) => {
    const { commentId, limit = LIMIT, offset = OFFSET } = req.query;
    const { user } = req;
    try {
      await checkCommentId(commentId);
      let replies = await RepliesModel.findAll({
        where: { commentId },
        limit: +limit,
        offset: +offset,
        include: [
          {
            model: UserModel,
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
        order: [["createdAt", "DESC"]],
      });

      replies = await Promise.all(
        replies.map((item) => validateResponse(item))
      );

      return res.json({ replies: reverse(replies) });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const createReplies = async (req, res) => {
    try {
      let reply = await RepliesModel.create({ ...req.body });
      reply.dataValues.owner = await UserModel.findOne({
        where: {
          id: reply.ownerId,
        },
        attributes: {
          exclude: ["password", "active", "createdAt", "updatedAt"],
        },
      });

      reply = await validateResponse(reply);
      return res.json({ reply });
    } catch (err) {
      return res.status(500).json({ message: "something went wrong" });
    }
  };

  const updateById = async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    try {
      await RepliesModel.update(
        { ...req.body },
        {
          where: {
            id,
          },
        }
      );
      let reply = await RepliesModel.findOne({
        where: { id },
        include: [
          {
            model: UserModel,
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
      });
      reply = await validateResponse(reply);
      return res.json({ reply });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const deleteReplyById = async (req, res) => {
    const { id } = req.params;
    try {
      await RepliesModel.destroy({ where: { id } });
      return res.json({ message: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  return { getAllReplies, createReplies, updateById, deleteReplyById };
};
