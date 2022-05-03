const express = require("express");
const cors = require("cors");
const router = require("./routes");
const globalError = require("./utils/global.error");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("morgan");
const db = require("./models");
const { PORT } = require("./config");
const channel = require("./channel");
// const io = require(".");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
channel(io, app);
// Enable security, CORS, compression, favicon and body parsing
app.set("io", io);
app.use(helmet());
app.use(cors());
app.use(compression());
// parse requests of content-type - application/json
app.use(express.json());
app.use(
  express.urlencoded({
    limit: "20mb",
    extended: true,
  })
);
app.use(logger("dev"));

db.sequelize.sync();
router(app);

app.use(globalError);

http.listen(PORT, function () {
  console.log(`starting server at port: ${PORT}`);
});
// module.exports = app;
