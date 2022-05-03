const db = require("./models");

module.exports = (io, callback) => {
  const userModel = db.users;

  io.on("connection", (socket) => {
    console.log("Co nguoi join phong: " + socket.id);
    socket.on("auth", (user) => {
      console.log("joinroom");
      socket.join(`userIds/${user.userId}`);
    });

    socket.on("logout", (userId) => {
      console.log("logout");
      socket.leave(`userIds/${userId}`);
    });

    socket.on("send", async () => {
      const user = await userModel.findOne({
        where: { email: "kien.ndd183935k@gmail.com" },
      });
      io.to(`userIds/${user.userId}`).emit("testnoti", "ss");
    });

    socket.on("disconnect", () => {
      console.log("disconnect:" + socket.id);
    });
  });
};
