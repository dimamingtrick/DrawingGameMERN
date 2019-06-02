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
      select: "-password",
    },
    "lastMessage",
  ]);

  if (chats.length === 0) {
    const allUsers = await User.find({
      _id: {
        $ne: objectId(userId),
      },
    });
    allUsers.forEach(async user => {
      const chat = new Chat({
        users: [objectId(userId), objectId(user._id)],
      });
      await chat.save();
    });

    const newCreatedChats = await Chat.find({
      users: objectId(userId),
    }).populate([
      {
        path: "users",
        select: "-password",
      },
      "lastMessage",
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
      users: objectId(req.body.userId),
    }).populate([
      {
        path: "users",
        select: "-password",
      },
      "lastMessage",
    ]),
    ChatMessage.find({
      chatId: objectId(chatId),
    }),
  ]);

  return res.json({ chat, messages });
});

/**
 * POST /chats/:id/messages
 * send new message
 */
const fileUpload = require("express-fileupload");
router.post(
  "/:id/messages",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    const { message, type, userId } = req.body;
    const chatId = req.params.id;

    let messageField = message;
    if (req.files) {
      const filePath = `chatMessages/${userId}${Date.now()}${
        req.files.file.name
      }`;
      const fileServerUrl = `${require("app-root-path")}/uploads/${filePath}`;

      messageField = await new Promise((resolve, reject) => {
        req.files.file.mv(fileServerUrl, err => {
          if (err) return res.status(400).json({ message: err });

          const fullImageUrl = `http://${req.get("host")}/${filePath}`;
          resolve(fullImageUrl);
        });
      });
    }

    const msg = new ChatMessage({
      userId: objectId(userId),
      chatId: objectId(chatId),
      message: messageField,
      type,
    });
    const newMessage = await msg.save();

    const io = req.app.get("socketio");

    await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: newMessage._id,
        },
      },
      { new: true }
    )
      .populate([
        {
          path: "users",
          select: "-password",
        },
        "lastMessage",
      ])
      .exec((err, updatedChat) => {
        if (err || !updatedChat)
          return res.status(400).json({ message: err || "Error" });

        io.emit(`chat-${chatId}-getUpdate`, updatedChat);
        io.emit(`chat-${chatId}-newMessage`, newMessage);
        return res.json({});
      });
  }
);

/**
 * DELETE /chats/:id/messages
 * delete single chat message
 */
router.delete("/:id/messages/:messageId", async (req, res) => {
  const chatId = req.params.id;
  ChatMessage.findOneAndDelete(
    {
      _id: objectId(req.params.messageId),
      chatId: objectId(chatId),
    },
    async (err, deletedMessage) => {
      if (err || !deletedMessage)
        return res.status(404).json({ message: err || "Message not found" });

      const newLastChatMessage = await ChatMessage.find({
        chatId: objectId(chatId),
      })
        .limit(1)
        .sort({ $natural: -1 });

      await Chat.findByIdAndUpdate(
        chatId,
        {
          $set: {
            lastMessage: newLastChatMessage[0]._id,
          },
        },
        { new: true }
      )
        .populate([
          {
            path: "users",
            select: "-password",
          },
          "lastMessage",
        ])
        .exec((err, updatedChat) => {
          if (err || !updatedChat)
            return res.status(400).json({ message: err || "Error" });

          const io = req.app.get("socketio");
          io.emit(`chat-${chatId}-getUpdate`, updatedChat);
          io.emit(`chat-${chatId}-messageDeleted`, {
            messageId: req.params.messageId,
            userId: req.body.userId,
          });
          res.json({ message: "item was successfully deleted" });
        });
    }
  );
});

/**
 * PUT /chats/:id/messages/:messageId
 * updates single chat message
 */
router.put("/:id/messages/:messageId", async (req, res) => {
  const chatId = req.params.id;

  ChatMessage.findOneAndUpdate(
    {
      _id: objectId(req.params.messageId),
      chatId: objectId(chatId),
    },
    {
      $set: {
        message: req.body.message,
      },
    },
    { new: true },
    async (err, updatedMessage) => {
      if (err || !updatedMessage)
        return res.status(404).json({ message: err || "Message not found" });

      const io = req.app.get("socketio");
      io.emit(`chat-${chatId}-messageUpdated`, updatedMessage);
      res.json({ updatedMessage });
    }
  );
});

module.exports = router;
