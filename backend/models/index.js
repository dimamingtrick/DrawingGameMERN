import mongoose from "mongoose";

import User from "./userModel";
import Todo from "./todoModel";

const connectDb = () => {
  return mongoose.connect(
    "mongodb://localhost:27017/node-express-mongodb-server"
  );
};

export { User, Todo };

export default connectDb;
