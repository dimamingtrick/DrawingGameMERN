import mongoose from "mongoose";

import User from "./userModel";
import Todo from "./todoModel";
import Chat from "./chatModel";
import GameSettings from "./gameSettingsModel";

const connectDb = () => {
  return mongoose.connect(
    "mongodb://localhost:27017/node-express-mongodb-server"
  );
};

export { User, Todo, Chat, GameSettings };

export default connectDb;
