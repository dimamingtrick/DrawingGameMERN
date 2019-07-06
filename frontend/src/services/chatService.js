import api from "./api";

class ChatService {
  getAllChats() {
    return api({
      method: "GET",
      url: "/chats",
    });
  }

  getSingleChatById(id) {
    return api({
      method: "GET",
      url: "/chats/" + id,
    });
  }

  sendNewMessage(chatId, message, type) {
    return api({
      method: "POST",
      url: `/chats/${chatId}/messages`,
      body: message,
      contentType: type === "image" ? "file" : "text",
    });
  }

  editMessage(chatId, message, messageId) {
    return api({
      method: "PUT",
      url: `/chats/${chatId}/messages/${messageId}`,
      body: message,
    });
  }

  deleteMessage(chatId, messageId) {
    return api({
      method: "DELETE",
      url: `/chats/${chatId}/messages/${messageId}`,
      body: {},
    });
  }

  addNewChat(newChatData) {
    return api({
      method: "POST",
      url: "/chats",
      body: newChatData,
    });
  }

  deleteChat(chatId) {
    return api({
      method: "DELETE",
      url: `/chats/${chatId}`,
      body: {},
    });
  }

  leaveChat(chatId) {
    return api({
      method: "GET",
      url: `/chats/${chatId}/leave`,
    });
  }
}

export default new ChatService();
