const db = require("../models");
var createModel = require("../models/users.model");

module.exports = function () {
  var userModel = db.users;
  checkDuplicateMail = async (req, res, next) => {
    const { forgot } = req.body;
    if (forgot) next();
    const user = await userModel.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user && user.active) {
      return res
        .status(400)
        .json({ message: "Failt! email is already in use" });
    }
    next();
  };
  return { checkDuplicateMail };
};
