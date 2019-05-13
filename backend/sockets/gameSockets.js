import { User, GameWords } from "../models";
import { getNewRandomWord } from "../helpers";

module.exports = (socket, io) => {
  /**
   * Returns word, users need to guess
   * If there is no selectedToGuess word it will select "computer" word as default
   * If no default "computer" word in db - add it with selectedToGuess = true
   * If word is in db - update it's selectedToGuess propeprty to true
   * for drawer
   */
  socket.on("getNewGameWordToGuess", async () => {
    const word = await GameWords.findOne({ selectedToGuess: true });
    if (word) return io.emit("newGameWordToGuess", { word: word.word });

    const wordInDB = await GameWords.findOne({ word: "computer" });

    if (!wordInDB) {
      const addWord = new GameWords({
        word: "computer",
        selectedToGuess: true
      });
      const newWord = await addWord.save();
      io.emit("newGameWordToGuess", { word: newWord.word });
    } else {
      GameWords.findByIdAndUpdate(
        wordInDB._id,
        {
          $set: {
            selectedToGuess: true
          }
        },
        { new: true },
        (newWordError, { word }) => {
          io.emit("newGameWordToGuess", { word });
        }
      );
    }
  });

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
    const [
      allWords, // all words in database
      { word: wordToGuess }, // word, users need to guess
      { login, role } // user, that send message
    ] = await Promise.all([
      GameWords.find({ selectedToGuess: false }),
      GameWords.findOne({ selectedToGuess: true }),
      User.findById(userId)
    ]);

    if (role === "admin")
      return console.log("Admin cannot send messages to game chat");

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
        () => {
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
              io.emit("newGameWordToGuess", { word: newWordToGuessObject });
              io.emit("newGameDraw", { draw: null });
              socket.emit("gameLoadingStop");
            }
          );
        }
      );
    }
  });
};
