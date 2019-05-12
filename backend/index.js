import connectDb from "./models";
import express from "express";
import cors from "cors";
import { jwtValidate } from "./helpers";

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

/** Add express body parser to convert request body params */
app.use(express.json());

/** Add socket.io object to every request by req.app.get("socketio") */
app.set("socketio", io);

/** Add cors to server */
app.use(cors());

/** Add authoriation routes */
app.use(require("./routes/authorizationRoutes"));

/**
 *  Add /todo model CRUD routes
 *  Require JWT token
 */
app.use("/todo", jwtValidate, require("./routes/todoRoutes"));

/**
 * Add /game/chat routes
 * Require JWT token
 */
app.use("/game", jwtValidate, require("./routes/gameRoutes"));

/**
 * GET /
 * Basic default route to initiate server
 */
app.get("/", async (req, res) => {
  return res.json("Good game");
});

connectDb().then(() => {
  server.listen(3001, function() {
    io.on("connection", socket => {
      socket.emit("socketWorks", { horray: "Socket works" });

      /** Use chat sockets */
      require("./sockets/gameSockets")(socket, io);
    });
  });
});
