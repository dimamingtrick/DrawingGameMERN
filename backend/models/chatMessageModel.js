import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String || Number
  },
  chatId: {
    type: String || Number
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  type: {
    type: String // would be text or image
  }
});

const ChatMessage = mongoose.model("chatMessage", chatMessageSchema);

export default ChatMessage;
