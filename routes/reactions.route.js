const express = require("express");
const reactionsController = require("../controllers/reactions/reactions.controller");

module.exports = () => {
  var router = express.Router();
  const { createReaction } = reactionsController();

  router.route("/").post(createReaction);

  return router;
};
