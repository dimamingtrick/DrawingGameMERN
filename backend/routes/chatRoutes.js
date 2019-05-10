import { User, Chat } from "../models";

const express = require("express");
const router = express.Router();

/**
 * GET /game/chat/
 * returns all chat messages
 */
router.get("/", async (req, res) => {
  const messages = await Chat.find({});
  return res.status(200).json(messages);
});

/**
 * POST /game/chat/
 * add new chat message
 * send it with socket.io
 */
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  if (!message)
    return res.status(400).json({ message: "Message text is required" });

  const userWinTheGame = message === "tricking"; // check if user enter the right word

  const { login } = await User.findById(userId);
  const msg = new Chat({
    message,
    user: login,
    createdAt: new Date(),
    type: "message"
  });
  const newMessage = await msg.save();

  const io = req.app.get("socketio");
  io.emit("newMessage", { newMessage });

  if (userWinTheGame) {
    const winMessage = new Chat({
      message: `User ${login} guess the word "tricking"`,
      user: login,
      createdAt: new Date(),
      type: "chatUserWinGame"
    });
    io.emit("newMessage", { newMessage: winMessage });
    io.emit("newDraw", { draw: null });
  }

  return res.json(newMessage);
});

// router.post("/paint", async (req, res) => {
//   const { draw } = req.body;
//   const io = req.app.get("socketio");
//   io.emit("newDraw", { draw });
// });

/**
 * Exporting routes and sockets function
 */
module.exports = {
  router,
  sockets: socket => {
    socket.on("sendNewDraw", draw => {
      socket.broadcast.emit("newDraw", { draw });
    });

    socket.on("clearDrawRequest", () => {
      socket.broadcast.emit("newDraw", { draw: null });
    });

    // When someone connects /app/game page (componentDidMount hook)
    socket.on("chatConnectRequest", ({ user }) => {
      // create and send new message object but not save it to database
      const newMessage = new Chat({
        message: `User ${user} joins a chat`,
        user: null,
        createdAt: new Date(),
        type: "join"
      });

      socket.emit("newMessage", { newMessage });
    });

    // When someone leaves /app/game page (componentUnmount hook)
    socket.on("chatDisconnectRequest", ({ user }) => {
      // create and send new message object but not save it to database
      const newMessage = new Chat({
        message: `User ${user} leaves a chat`,
        user: null,
        createdAt: new Date(),
        type: "leave"
      });

      socket.broadcast.emit("newMessage", { newMessage });
      socket.broadcast.emit("newDraw", { draw: null });
    });
  }
};
