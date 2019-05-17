import { User, GameWords } from "../models";
import { getNewRandomWord } from "../helpers";

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
};
