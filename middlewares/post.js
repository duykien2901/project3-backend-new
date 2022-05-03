const postSchema = require("../controllers/posts/post.schema");

exports.postMiddleware = (req, res, next) => {
  const { mentions, images } = req.body;
  try {
    const { error } = postSchema.validate({ ...req.body });
    if (error) {
      console.log("object");
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
