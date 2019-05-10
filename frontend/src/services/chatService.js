import api from "./api";

class ChatService {
  getAllMessages() {
    return api({
      method: "GET",
      url: "/game/chat",
    });
  }

  sendNewMessage(message) {
    return api({
      method: "POST",
      url: "/game/chat",
      body: { message },
    });
  }
}

export default new ChatService();
