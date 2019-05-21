import api from "./api";

class ChatService {
  getAllChats() {
    return api({
      method: "GET",
      url: "/chats"
    });
  }

  getSingleChatById(id) {
    return api({
      method: "GET",
      url: "/chats/" + id
    });
  }

  sendNewMessage(id, message, type) {
    return api({
      method: "POST",
      url: "/chats/" + id,
      body: message,
      contentType: type === "image" ? "file" : "text"
    });
  }

  deleteMessage(chatId, messageId) {
    return api({
      method: "DELETE",
      url: `/chats/${chatId}/messages`,
      body: { messageId }
    });
  }
}

export default new ChatService();
