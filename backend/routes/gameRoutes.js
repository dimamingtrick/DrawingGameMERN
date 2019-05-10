import { User, Chat } from "../models";

const express = require("express");
const router = express.Router();

/**
 * GET /game/chat/
 * returns all chat messages
 */
router.get("/chat", async (req, res) => {
  const messages = await Chat.find({});
  return res.status(200).json(messages);
});

/**
 * POST /game/chat/
 * add new chat message
 * send it with socket.io
 */
router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!message)
    return res.status(400).json({ message: "Message text is required" });

  const userWinTheGame = message === "tricking"; // check if user enter the right word

  const { login } = await User.findById(userId);
  const newMessage = {
    message,
    user: login,
    createdAt: new Date(),
    type: "message",
  };

  const io = req.app.get("socketio");
  io.emit("newGameChatMessage", { newMessage });

  if (userWinTheGame) {
    const winMessage = {
      message: `User ${login} guess the word "tricking"`,
      user: login,
      createdAt: new Date(),
      type: "chatUserWinGame",
    };
    io.emit("newGameChatMessage", { newMessage: winMessage });
    io.emit("newGameDraw", { draw: null });
  }

  return res.json(newMessage);
});

module.exports = router;
