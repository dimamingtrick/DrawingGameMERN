import mongoose from "mongoose";

const gameWordsSchema = new mongoose.Schema({
  word: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const GameWords = mongoose.model("GameWords", gameWordsSchema);

export default GameWords;
