var express = require("express");
const postsController = require("../controllers/posts/posts.controller");
const { postMiddleware } = require("../middlewares/post");

module.exports = (app) => {
  var router = express.Router();
  const {
    createPost,
    getAllPost,
    getPostById,
    updatePostById,
    deleteById,
    getPostByUser,
  } = postsController(app);

  router.route("/").get(getAllPost).post(postMiddleware, createPost);
  router.route("/user/:userId").get(getPostByUser);
  router
    .route("/:id")
    .get(getPostById)
    .put(postMiddleware, updatePostById)
    .delete(deleteById);

  return router;
};
