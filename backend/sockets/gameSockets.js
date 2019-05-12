import { User, GameSettings } from "../models";

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
  let words = ["ball", "dog", "cat", "game"];
  function getNewRandomWord(oldWord) {
    const newWord = words[Math.floor(Math.random() * words.length)];
    if (newWord === oldWord) {
      return getNewRandomWord(oldWOrd);
    }
    return newWord;
  }

  socket.on("sendNewGameChatMessage", async ({ message, userId }) => {
    const { word: wordToGuess } = await GameSettings.findById(
      "5cd86f340b6ec018f06bee38"
    );

    const { login } = await User.findById(userId);

    const newMessage = {
      message,
      user: login,
      createdAt: new Date(),
      type: "message",
    };

    io.emit("newGameChatMessage", { newMessage });

    // check if user enter the right word
    if (message === wordToGuess) {
      const winMessage = {
        message: `User ${login} guess the word "${wordToGuess}"`,
        user: login,
        createdAt: new Date(),
        type: "chatUserWinGame",
      };
      io.emit("newGameChatMessage", { newMessage: winMessage });

      socket.emit("gameLoadingStart");
      const newWordToGuess = getNewRandomWord(wordToGuess);
      GameSettings.findByIdAndUpdate(
        "5cd86f340b6ec018f06bee38",
        {
          $set: {
            word: newWordToGuess,
          },
        },
        { new: true }, // Pass this to return updated object (by default returns old one)
        (err, { word }) => {
          console.log("11111111111111", word);
          socket.emit("newGameDraw", { draw: null });
          socket.emit("gameLoadingStop");
        }
      );
    }
  });
};
