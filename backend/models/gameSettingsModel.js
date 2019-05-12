import mongoose from "mongoose";

const gameSettingsSchema = new mongoose.Schema({
  word: {
    type: String,
  },
  // message: {
  //   type: String
  // },
  createdAt: {
    type: Date,
  },
  // type: {
  //   type: "string" || null
  // }
});

const GameSettings = mongoose.model("gameSettings", gameSettingsSchema);

export default GameSettings;
