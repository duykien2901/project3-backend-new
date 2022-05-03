const repliesSchema = require("../controllers/comments/schema/replies.schema");
const db = require("../models");

exports.repliesMiddleware = (req, res, next) => {
  const { mentions, images } = req.body;
  try {
    const { error } = repliesSchema.validate({ ...req.body });
    if (error) {
      throw new Error(error);
    }
    req.body = {
      ...req.body,
      mentions: !!mentions.length ? mentions.join(", ") : null,
      images: !!images.length ? images.join(", ") : null,
    };
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.checkRepliesId = async (req, res, next) => {
  const RepliesModel = db.replies;
  const { id } = req.params;
  const reply = await RepliesModel.findByPk(+id);
  if (!reply) {
    return res.status(404).json({ message: "Reply not found" });
  }
  next();
};
