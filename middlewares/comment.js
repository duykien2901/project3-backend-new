const commentSchema = require("../controllers/comments/schema/comments.schema");

exports.commentMiddleware = (req, res, next) => {
  const { mentions, images } = req.body;
  try {
    const { error } = commentSchema.validate({ ...req.body });
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
