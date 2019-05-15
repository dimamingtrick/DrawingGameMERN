import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String || Number
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  type: {
    type: String, // would be text or image,
    default: "text"
  }
});

const ChatMessage = mongoose.model("chatMessage", chatMessageSchema);

export default ChatMessage;
