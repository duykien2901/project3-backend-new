const Joi = require("joi");

const groupSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  members: Joi.array().items(Joi.string()),
  accessLevel: Joi.number().integer(),
  permission: Joi.number().integer()
});

module.exports = groupSchema;