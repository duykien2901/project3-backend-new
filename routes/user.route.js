var express = require("express");
const userFollowsController = require("../controllers/follows/user-follows.controller");
var userController = require("../controllers/users/user.controller");

module.exports = () => {
  var router = express.Router();
  const { getUser, changeUserProfile, acceptChangeMail, getUserByName } =
    userController();
  const { createUserFollow, deleteUserFollows } = userFollowsController();

  router.route("/").get(getUserByName);
  router.route("/:id").get(getUser).patch(changeUserProfile);
  router.route("/:id/follows").post(createUserFollow).delete(deleteUserFollows);
  router.put("/accept-mail", acceptChangeMail);
  return router;
};
