import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  type: {
    type: String || File, // would be text or image,
    default: "text",
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
});

const ChatMessage = mongoose.model("chatMessage", chatMessageSchema);

export default ChatMessage;
