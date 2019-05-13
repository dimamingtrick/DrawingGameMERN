import mongoose from "mongoose";

const gameWordsSchema = new mongoose.Schema({
  word: {
    type: String
  },
  selectedToGuess: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const GameWords = mongoose.model("GameWords", gameWordsSchema);

export default GameWords;
