const db = require("../../models");
const { Op } = require("sequelize");

module.exports = () => {
  const ReactionsModel = db.reactions;

  const condition = ({ postId, commentId, replyId }) => {
    return {
      [Op.and]: [{ postId }, { commentId }, { replyId }],
    };
  };

  const createReaction = async (req, res) => {
    const { postId, commentId, replyId, vote } = req.body;
    const reaction = await ReactionsModel.findOne({
      where: {
        ...condition({ postId, commentId, replyId }),
        userId: req.user.id,
      },
    });
    try {
      if (reaction) {
        await ReactionsModel.update(
          { vote },
          {
            where: { id: reaction.id },
          }
        );
        return res.json({ reaction });
      } else {
        const reactionNew = await ReactionsModel.create({ ...req.body });
        return res.json({ reaction: reactionNew });
      }
    } catch (error) {
      return res.status(500).error({ message: "Something went wrong" });
    }
  };

  return { createReaction };
};
