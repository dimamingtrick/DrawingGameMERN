import { User, GameWords } from "../models";
import { getNewRandomWord } from "../helpers";

module.exports = (socket, io) => {
  /**
   * Detect when admin enter game
   */
  socket.on("adminEnterGame", () => {
    io.emit("adminIsInTheGame");
  });
};
