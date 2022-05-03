var express = require("express");
const commentsController = require("../controllers/comments/comments.controller");
const { commentMiddleware } = require("../middlewares/comment");

module.exports = () => {
  var router = express.Router();
  const { createComment, getCommentByPage, editComment, deleteCommentById } =
    commentsController();
  router
    .route("/")
    .get(getCommentByPage)
    .post(commentMiddleware, createComment);

  router
    .route("/:id")
    .put(commentMiddleware, editComment)
    .delete(deleteCommentById);
  return router;
};
