import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date()
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
  // users: [String]
});

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
