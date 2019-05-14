import mongoose from "mongoose";

import User from "./userModel";
import Todo from "./todoModel";
import Chat from "./chatModel";
import ChatMessage from "./chatMessageModel";
import GameSettings from "./gameSettingsModel";
import GameWords from "./gameWords";

const connectDb = () => {
  return mongoose.connect(
    "mongodb://localhost:27017/node-express-mongodb-server"
  );
};

export { User, Todo, Chat, ChatMessage, GameSettings, GameWords };

export default connectDb;
