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

  sendNewMessage(id, message) {
    return api({
      method: "POST",
      url: "/chats/" + id,
      body: message
    });
  }
}

export default new ChatService();
