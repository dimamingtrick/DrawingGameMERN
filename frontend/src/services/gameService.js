import api from "./api";

class GameService {
  getGameSettings() {
    return api({ method: "GET", url: "/game/settings" });
  }

  getAllGameWords() {
    return api({ method: "GET", url: "/game/words" });
  }

  addNewGameWord(data) {
    return api({ method: "POST", url: "/game/words", body: data });
  }

  deleteGameWord(id) {
    return api({ method: "DELETE", url: "/game/words/" + id, body: {} });
  }
}

export default new GameService();
