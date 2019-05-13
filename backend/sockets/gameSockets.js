import { User, GameWords } from "../models";
import { getNewRandomWord } from "../helpers";

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
      type: "join"
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
      type: "leave"
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
    const [allWords, { word: wordToGuess }] = await Promise.all([
      GameWords.find({ selectedToGuess: false }),
      GameWords.findOne({ selectedToGuess: true })
    ]);

    const { login } = await User.findById(userId);

    const newMessage = {
      message,
      user: login,
      createdAt: new Date(),
      type: "message"
    };

    io.emit("newGameChatMessage", { newMessage });

    // check if user enter the right word
    if (message === wordToGuess) {
      const winMessage = {
        message: `User ${login} guess the word "${wordToGuess}"`,
        user: login,
        createdAt: new Date(),
        type: "chatUserWinGame"
      };
      io.emit("newGameChatMessage", { newMessage: winMessage });

      socket.emit("gameLoadingStart");

      const newWordToGuess = getNewRandomWord(allWords);
      GameWords.findOneAndUpdate(
        {
          selectedToGuess: true
        },
        {
          $set: {
            selectedToGuess: false
          }
        },
        { new: true },
        (err, word) => {
          GameWords.findByIdAndUpdate(
            newWordToGuess.id,
            {
              $set: {
                selectedToGuess: true
              }
            },
            { new: true },
            (newWordError, { word: newWordToGuessObject }) => {
              console.log("@@@@@@@@@@ new word is - ", newWordToGuessObject);
              socket.emit("newGameDraw", { draw: null });
              socket.emit("gameLoadingStop");
            }
          );
        }
      );
    }
  });
};
