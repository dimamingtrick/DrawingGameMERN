import connectDb from "./models";
import express from "express";
import cors from "cors";
import { jwtValidate } from "./helpers";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

/** Make uploads directory public */
app.use(express.static(__dirname + "/uploads"));
// app.use("/chatMessages", express.static(__dirname + "/uploads/chatMessages"));

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
 * Add /game routes (settings, etc)
 * Require JWT token
 */
app.use("/game", jwtValidate, require("./routes/gameRoutes"));

/**
 * Add /game/words routes
 * Require JWT token and admin permission roles
 */
app.use("/game/words", jwtValidate, require("./routes/gameWordsRoutes"));

/**
 * Add /chats routes
 * Require JWT token
 */
app.use("/chats", jwtValidate, require("./routes/chatRoutes"));

/**
 * Add /users routes
 * Require JWT token
 */
app.use("/users", jwtValidate, require("./routes/userRoutes"));

/**
 * GET /
 * Basic default route to initiate server
 */
app.get("/", async (req, res) => {
  return res.json("Good game");
});

/**
 * Connecting to database
 * Then start node.js server
 * Then require all sockets from different modules
 */
connectDb().then(() => {
  server.listen(3001, function() {
    io.on("connection", socket => {
      /** Use user sockets (online/offline) */
      require("./sockets/usersSockets")(socket, io);

      /** Use game sockets */
      require("./sockets/gameSockets")(socket, io);

      /** Use chat sockets */
      require("./sockets/chatSockets")(socket, io);
    });
  });
});
