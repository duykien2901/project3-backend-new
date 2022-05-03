const db = require("../models");

const validateResponse = async (data) => {
  let { mentions, images } = data;
  const userModel = db.users;
  data.images = images ? images.split(", ") : [];

  mentions = mentions ? mentions.split(", ") : [];
  let mentionUser = [];
  if (mentions !== []) {
    mentionUser = await Promise.all(
      mentions.map((userId) =>
        userModel.findOne({
          where: { userId },
          attributes: ["name", "userId", "profileImage"],
        })
      )
    );
  }
  data.mentions = mentionUser;
  if (data.reactions && data.reactions.length > 0) {
    data.dataValues.reactions = data.dataValues.reactions[0];
  } else data.reactions = null;
  return data;
};

module.exports = validateResponse;
