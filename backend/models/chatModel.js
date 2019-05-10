import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: {
    type: String
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date
  },
  type: {
    type: "string" || null
  }
});

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
