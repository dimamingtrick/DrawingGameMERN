import { ChatMessage } from "../models";
import { getUnreadChatsCount, getUnreadChatMessagesCount } from "../helpers";

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
    getUnreadChatsCount(io, userId);
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
      { new: true }
    )
      .populate(["likedBy"])
      .exec((err, updatedMessage) => {
        if (err || !updatedMessage)
          console.log("User read chat message error ", err);

        io.emit(`chat-${chatId}-userReadMessage`, updatedMessage);
        getUnreadChatsCount(io, userId);
        getUnreadChatMessagesCount(chatId, userId).then(unreadMessagesCount => {
          io.emit(`chat-${chatId}-${userId}-getUnreadMessagesCount`, {
            unreadMessagesCount,
            chatId,
          });
        });
      });
  });

  /**
   * User likes message
   */
  socket.on("userLikesMessage", async ({ userId, messageId, chatId }) => {
    ChatMessage.findOneAndUpdate(
      {
        _id: objectId(messageId),
        chatId: objectId(chatId),
        userId: {
          $ne: userId, // if user don't like his own message
        },
      },
      {
        $addToSet: {
          likedBy: [objectId(userId)],
        },
      },
      { new: true }
    )
      .populate(["likedBy"])
      .exec((err, updatedMessage) => {
        if (err || !updatedMessage)
          console.log("User likes chat message error ", err);

        io.emit(`chat-${chatId}-userLikesMessage`, updatedMessage);
      });
  });

  /**
   * User removes like from message
   */
  socket.on(
    "userRemoveLikeFromMessage",
    async ({ userId, messageId, chatId }) => {
      ChatMessage.findOneAndUpdate(
        {
          _id: objectId(messageId),
          chatId: objectId(chatId),
          userId: {
            $ne: userId, // if user don't like his own message
          },
        },
        {
          $pull: {
            likedBy: objectId(userId),
          },
        },
        { new: true }
      )
        .populate(["likedBy"])
        .exec((err, updatedMessage) => {
          if (err || !updatedMessage)
            console.log("User dislikes chat message error ", err);

          io.emit(`chat-${chatId}-userLikesMessage`, updatedMessage);
        });
    }
  );
};
