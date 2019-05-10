import connectDb from "./models";
import express from "express";
import cors from "cors";
import { jwtValidate } from "./helpers";

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

/** Add express body parser to convert request body params */
app.use(express.json());
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
app.use("/game/chat", jwtValidate, require("./routes/chatRoutes"));

/**
 * GET /
 * Basic default route to initiate server
 */
app.get("/", async (req, res) => {
  return res.send("Good game");
});

connectDb().then(async () => {
  // if (eraseDatabaseOnSync) {
  //   const mongoose = require("mongoose");
  //   createUsersWithMessages();
  // }
  server.listen(3001, () => {
    console.log("Example app listening on port 3001!");

    io.on("connection", function(socket) {
      socket.emit("socketWorks", { horray: "Socket works" });

      socket.on("sendNewDraw", draw => {
        socket.broadcast.emit("newDraw", { draw });
      });
    });
  });
});
