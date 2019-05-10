import { User } from "../models";

module.exports = (socket, io) => {
  /**
   * When user draw something in game
   * returns drawing (drawing coordinates)
   * for everyone but sender
   */
  socket.on("sendNewGameDraw", draw => {
    socket.broadcast.emit("newGameDraw", { draw });
  });

  /**
   * When drawer clears canvas
   * returns empty drawing (clear drawing)
   * for everyone but sender
   */
  socket.on("clearGameDrawRequest", () => {
    socket.broadcast.emit("newGameDraw", { draw: null });
  });

  /**
   * When someone connects /app/game page (componentDidMount hook)
   * returns 'join game' message
   * for everyone
   */
  socket.on("gameChatConnectRequest", ({ user }) => {
    const newMessage = {
      message: `User ${user} joins a game`,
      user: null,
      createdAt: new Date(),
      type: "join",
    };

    io.emit("newGameChatMessage", { newMessage });
  });

  /**
   * When someone leaves /app/game page (componentUnmount hook)
   * returns 'leave game' message
   */
  socket.on("gameChatDisconnectRequest", ({ user }) => {
    const newMessage = {
      message: `User ${user} leaves a game`,
      user: null,
      createdAt: new Date(),
      type: "leave",
    };

    socket.broadcast.emit("newGameChatMessage", { newMessage });
    socket.broadcast.emit("newGameDraw", { draw: null });
  });

  /**
   * When user send new message to game chat
   * returns:
   *     -simple message object
   *     -if user guess word - 'win game' message
   * for everyone
   */
  socket.on("sendNewGameChatMessage", async ({ message, userId }) => {
    const userWinTheGame = message === "tricking"; // check if user enter the right word

    const { login } = await User.findById(userId);

    const newMessage = {
      message,
      user: login,
      createdAt: new Date(),
      type: "message",
    };

    io.emit("newGameChatMessage", { newMessage });

    if (userWinTheGame) {
      const winMessage = {
        message: `User ${login} guess the word "tricking"`,
        user: login,
        createdAt: new Date(),
        type: "chatUserWinGame",
      };
      io.emit("newGameChatMessage", { newMessage: winMessage });
      socket.emit("newGameDraw", { draw: null });
      /**
       * LATER
       * emit "gameIsUpdating" event to init preloaders at game page and set new settings
       * add update game settings (add new word to guess)
       * and then emit "gameUpdatingIsFinished" to start the game
       */
    }
  });
};
