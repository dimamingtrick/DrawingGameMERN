import api from "./api";

class ChatService {
  getAllMessages() {
    return api({
      method: "GET",
      url: "/game/chat"
    });
  }

  sendNewMessage(message) {
    return api({
      method: "POST",
      url: "/game/chat",
      body: { message }
    });
  }

  postPaint(draw) {
    return api({
      method: "POST",
      url: "/game/chat/paint",
      body: { draw }
    });
  }
}

export default new ChatService();
