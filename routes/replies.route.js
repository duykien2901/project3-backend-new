var express = require("express");
const repliesController = require("../controllers/comments/replies.controller");
const { repliesMiddleware, checkRepliesId } = require("../middlewares/replies");

module.exports = () => {
  var router = express.Router();
  const { getAllReplies, createReplies, updateById, deleteReplyById } =
    repliesController();

  router
    .route("/:id")
    .put(checkRepliesId, repliesMiddleware, updateById)
    .delete(checkRepliesId, deleteReplyById);
  router.route("/").get(getAllReplies).post(repliesMiddleware, createReplies);

  return router;
};
