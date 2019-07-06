import { Chat, ChatMessage, User } from "../models";
import { getUnreadChatsCount, getUnreadChatMessagesCount } from "../helpers";

const objectId = require("mongodb").ObjectID;
const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

/**
 * GET /chats
 * returns all user chats
 */
router.get("/", async (req, res) => {
  const { userId } = req.body;

  let chats = await Chat.find({ users: objectId(userId) })
    .populate([
      {
        path: "users",
        select: "-password",
      },
      "lastMessage",
    ])
    .lean(); // use .lean() method to add property to chat object

  if (chats.length === 0) {
    const allUsers = await User.find({
      _id: {
        $ne: objectId(userId),
      },
    });

    await Promise.all(
      allUsers.map(async user => {
        const chat = new Chat({
          users: [objectId(userId), objectId(user._id)],
        });
        await chat.save();
      })
    );

    chats = await Chat.find({
      users: objectId(userId),
    })
      .populate([
        {
          path: "users",
          select: "-password",
        },
        "lastMessage",
      ])
      .lean();
  }

  const fullChats = await Promise.all(
    chats.map(async chat => {
      chat.unreadMessagesCount = await getUnreadChatMessagesCount(
        chat._id,
        userId
      );
      return chat;
    })
  );

  return res.json(
    fullChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );
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
    }).populate(["likedBy"]),
  ]);

  return res.json({ chat, messages });
});

/**
 * POST /chats/:id/messages
 * send new message
 */
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

    if (!messageField)
      return res.status(400).json({ message: "Message is required" });

    const msg = new ChatMessage({
      userId: objectId(userId),
      chatId: objectId(chatId),
      message: messageField,
      type,
      readBy: [objectId(userId)],
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
      .lean()
      .exec(async (err, updatedChat) => {
        if (err || !updatedChat)
          return res.status(400).json({ message: err || "Error" });

        io.emit(`chat-${chatId}-newMessage`, newMessage);

        updatedChat.users.forEach(async user => {
          // Get unreadMessagesCount for other users
          if (user._id !== userId) {
            const unreadMessagesCount = await getUnreadChatMessagesCount(
              updatedChat._id,
              user._id
            );
            getUnreadChatsCount(io, user._id);
            updatedChat.unreadMessagesCount = unreadMessagesCount;
          }

          io.emit(
            `chat-${updatedChat._id}-${user._id}-getChatUpdate`,
            updatedChat
          );
        });

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
        .lean()
        .exec((err, updatedChat) => {
          if (err || !updatedChat)
            return res.status(400).json({ message: err || "Error" });

          const io = req.app.get("socketio");

          // Emit updated chat with unreadMessagesCount for other users
          updatedChat.users.forEach(user => {
            getUnreadChatMessagesCount(updatedChat._id, user._id).then(
              unreadMessagesCount => {
                if (user._id !== req.body.userId) {
                  updatedChat.unreadMessagesCount = unreadMessagesCount;
                }
                io.emit(
                  `chat-${updatedChat._id}-${user._id}-getChatUpdate`,
                  updatedChat
                );
              }
            );
          });
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
        updatedAt: new Date(),
      },
    },
    { new: true }
  )
    .populate(["likedBy"])
    .exec(async (err, updatedMessage) => {
      if (err || !updatedMessage)
        return res.status(404).json({ message: err || "Message not found" });

      const io = req.app.get("socketio");
      io.emit(`chat-${chatId}-messageUpdated`, updatedMessage);
      res.json({ updatedMessage });
    });
});

/**
 * POST /chats
 * Add new chat (confiration between at least 3 users)
 */
router.post("/", async (req, res) => {
  const { userId, name, users } = req.body;

  const errors = [];
  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (!users)
    errors.push({
      field: "users",
      message: "You must add users to group chat",
    });
  if (users && users.length < 2)
    errors.push({
      field: "users",
      message: "You must invite at least 2 users to group chat",
    });

  if (errors.length > 0) return res.status(400).json(errors);

  const chat = new Chat({
    name,
    users: [...users.map(i => objectId(i)), objectId(userId)],
    createdBy: objectId(userId),
  });
  const newChat = await chat.save();
  const fullChatData = await Chat.findOne({
    _id: objectId(newChat._id),
  }).populate([
    {
      path: "users",
      select: "-password",
    },
    "lastMessage",
  ]);
  1;

  const socket = req.app.get("socket");
  users.forEach(u => socket.emit(`add-new-chat-${u}`, fullChatData));
  return res.json(fullChatData);
});

/**
 * DELETE /chats/:id
 */
router.delete("/:id", async (req, res) => {
  const { userId } = req.body;
  const { id: chatId } = req.params;

  Chat.findOneAndDelete(
    {
      _id: objectId(chatId),
      createdBy: objectId(userId),
    },
    async (err, deletedChat) => {
      if (err) return res.status(400).json({ message: "Error, try again" });
      if (!deletedChat)
        return res.status(404).json({
          message: "You can't delete chat that wasn't created by you",
        });
      if (!err && deletedChat) return res.json("Chat was deleted");
    }
  );
});

/**
 * GET /chats/:id/leave
 */
router.get("/:id/leave", async (req, res) => {
  const { userId } = req.body;
  const { id: chatId } = req.params;

  Chat.findOneAndUpdate(
    {
      _id: objectId(chatId),
      users: objectId(userId),
    },
    {
      $pull: {
        users: objectId(userId),
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
    .lean()
    .exec(async (err, chat) => {
      if (err) return res.status(400).json({ message: "Error, try again" });
      if (!chat)
        return res
          .status(404)
          .json({ message: "You can't leave chat that you are not in" });
      if (!err && chat) return res.json("Chat was leaved");
    });
});

/**
 * PUT /chats/:id/invite
 */
router.put("/:id/invite", async (req, res) => {
  const { userId, users } = req.body;
  const { id: chatId } = req.params;

  if (!users || users.length === 0)
    return res
      .status(400)
      .json({ message: "You must select at least one user" });

  Chat.findOneAndUpdate(
    {
      _id: objectId(chatId),
      users: objectId(userId),
    },
    {
      $addToSet: {
        users: [...users.map(i => objectId(i))],
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
    .lean()
    .exec(async (err, chat) => {
      if (err) return res.status(400).json({ message: "Error, try again" });
      if (!chat)
        return res.status(404).json({ message: "Chat doesn't exists" });
      if (!err && chat) return res.json(chat);
    });
});

module.exports = router;
