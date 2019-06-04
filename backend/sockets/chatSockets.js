import { Chat, ChatMessage } from "../models";
// import { getNewRandomWord } from "../helpers";
const objectId = require("mongodb").ObjectID;

module.exports = (socket, io) => {
  /**
   * Detect when admin enter game
   */
  socket.on("adminEnterGame", () => {
    io.emit("adminIsInTheGame");
  });

  /**
   * Detect when user starts typing
   */
  socket.on("chatUserIsTyping", chatId => {
    socket.broadcast.emit(`chat${chatId}UserTypes`);
  });

  /**
   * Detect when user stops typing
   */
  socket.on("chatUserStopTyping", chatId => {
    socket.broadcast.emit(`chat${chatId}UserStopTyping`);
  });

  /**
   * Get all chats count with unread messages
   */
  socket.on("getChatsWithUnreadMessages", async userId => {
    const chats = await Chat.find({ users: objectId(userId) });

    let unreadMessagesCount = 0;
    await Promise.all(
      chats.map(async i => {
        let unreadMessages = await ChatMessage.find({
          chatId: objectId(i._id),
          readBy: {
            $ne: objectId(userId),
          },
        });
        if (unreadMessages.length > 0) unreadMessagesCount++;
      })
    );
    console.log("123123123_)_)_)_)_)_)_)", unreadMessagesCount);
    io.emit(`${userId}-chatsWithUnreadMessages`, unreadMessagesCount);
  });

  /**
   * User read message
   */
  socket.on("userReadChatMessage", async ({ userId, messageId, chatId }) => {
    ChatMessage.findOneAndUpdate(
      {
        _id: objectId(messageId),
        chatId: objectId(chatId),
      },
      {
        $addToSet: {
          readBy: [objectId(userId)],
        },
      },
      { new: true },
      (err, updatedMessage) => {
        if (!err && updatedMessage) console.log("######", err);
        console.log("@@@@@@", updatedMessage);
        io.emit(`chat-${chatId}-userReadMessage`, updatedMessage);
      }
    );
  });
};
