import { Chat, ChatMessage, User } from "../models";

const objectId = require("mongodb").ObjectID;
const express = require("express");
const router = express.Router();

/**
 * GET /chats
 * returns all user todos
 */
router.get("/", async (req, res) => {
  const { userId } = req.body;

  const chats = await Chat.find({ users: objectId(userId) }).populate([
    {
      path: "users",
      select: "-password"
    },
    "lastMessage"
  ]);

  if (chats.length === 0) {
    const allUsers = await User.find({
      _id: {
        $ne: objectId(userId)
      }
    });
    allUsers.forEach(async user => {
      const chat = new Chat({
        users: [objectId(userId), objectId(user._id)]
      });
      await chat.save();
    });

    const newCreatedChats = await Chat.find({
      users: objectId(userId)
    }).populate([
      {
        path: "users",
        select: "-password"
      },
      "lastMessage"
    ]);
    return res.json(newCreatedChats);
  }

  return res.json(chats);
});

/**
 * GET /chats/:id
 * returns single user chat by id
 */
router.get("/:id", async (req, res) => {
  const chatId = req.params.id;
  const [chat, messages] = await Promise.all([
    Chat.findOne({
      _id: objectId(chatId),
      users: objectId(req.body.userId)
    }).populate([
      {
        path: "users",
        select: "-password"
      }
    ]),
    ChatMessage.find({
      chatId: objectId(chatId)
    })
  ]);

  return res.json({ chat, messages });
});

/**
 * POST /chats
 * send new message
 */
router.post("/:id", async (req, res) => {
  const { message, userId } = req.body;
  const chatId = req.params.id;
  const msg = new ChatMessage({
    userId: objectId(userId),
    chatId: objectId(),
    message
  });
  const newMessage = await msg.save();

  const io = req.app.get("socketio");

  await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: newMessage._id
      }
    },
    { new: true }
  )
    .populate([
      {
        path: "users",
        select: "-password"
      },
      "lastMessage"
    ])
    .exec((err, updatedChat) => {
      if (err || !updatedChat)
        return res.status(400).json({ message: err || "Error" });

      io.emit(`chat-${chatId}-getUpdate`, { updatedChat });
      io.emit(`chat-${chatId}-newMessage`, { newMessage });
      return res.json({});
    });
});

module.exports = router;
