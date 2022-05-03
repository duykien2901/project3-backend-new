var express = require("express");
var userRouter = require("./user.route");
var authRouter = require("./auth.route");
var groupRouter = require("./group.route");
var postRouter = require("./post.route");
var commentRouter = require("./comments.route");
const repliesRouter = require("./replies.route");
const authJwt = require("../middlewares/authJwt");
const reactionRouter = require("./reactions.route");

module.exports = (app) => {
  var router = express.Router();
  const { verifyToken } = authJwt();
  // let room;
  // io.on("connection", (socket) => {
  //   app.socket = socket;
  //   socket.on("auth", (user) => {
  //     room = `userIds/${user.userId}`;
  //     socket.join(`userIds/${user.userId}`);
  //   });
  //   io.to(room).emit("testnoti", "ss");
  // });
  // const io = app.get("io");
  // io.emit("t", "ss");

  router.use("/user", userRouter(app));
  router.use("/group", verifyToken, groupRouter());
  router.use("/posts", verifyToken, postRouter(app));
  router.use("/comments", verifyToken, commentRouter());
  router.use("/replies", verifyToken, repliesRouter());
  router.use("/reactions", verifyToken, reactionRouter());
  router.use("/", authRouter());

  app.use("/api/v1", router);
};
