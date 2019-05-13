import mongoose from "mongoose";

const gameSettingsSchema = new mongoose.Schema({
  background: {
    type: String,
    default:
      "https://i.pinimg.com/originals/94/65/d3/9465d39cbdcee717aa6062bc1cc144d8.jpg"
  },
  userId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const GameSettings = mongoose.model("gameSettings", gameSettingsSchema);

export default GameSettings;
