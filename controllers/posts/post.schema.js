const Joi = require("joi");

const postSchema = Joi.object({
  category: Joi.number().integer(),
  mentions: Joi.array().items(Joi.string()),
  title: Joi.string(),
  images: Joi.array().items(Joi.string()),
  views: Joi.number().integer(),
  content: Joi.string().allow(""),
  modeHide: Joi.number(),
  feeling: Joi.string(),
  ownerId: Joi.number().integer().required(),
  groupId: Joi.number().integer(),
});

module.exports = postSchema;
