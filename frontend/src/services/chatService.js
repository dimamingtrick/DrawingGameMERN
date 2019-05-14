import api from "./api";

class ChatService {
  getAllChats() {
    return api({
      method: "GET",
      url: "/chats"
    });
  }

  sendNewMessage(message) {
    return api({
      method: "POST",
      url: "/game/chat",
      body: { message }
    });
  }
}

export default new ChatService();
