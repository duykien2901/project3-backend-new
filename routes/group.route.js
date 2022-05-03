var express = require("express");
var groupController = require("../controllers/groups/groups.controller");

module.exports = () => {
  var router = express.Router();
  const { createGroup, getGroupInfor } = groupController();

  router.route("/").post(createGroup);
  router.route("/:id").get(getGroupInfor);
  return router;
};
