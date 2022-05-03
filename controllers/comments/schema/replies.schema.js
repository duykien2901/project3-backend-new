var Joi = require("joi");

const repliesSchema = Joi.object({
  content: Joi.string().allow(""),
  mentions: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  postId: Joi.number().required("Post id is required"),
  ownerId: Joi.number().required("Owner id is required"),
  commentId: Joi.number().required(),
});

module.exports = repliesSchema;
