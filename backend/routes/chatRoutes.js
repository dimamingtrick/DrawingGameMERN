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
 */
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  if (!message)
    return res.status(400).json({ message: "Message text is required" });

  const { login } = await User.findById(userId);
  const msg = new Chat({
    message,
    user: login,
    createdAt: new Date()
  });
  const newMessage = await msg.save();
  return res.json(newMessage);
});

module.exports = router;
