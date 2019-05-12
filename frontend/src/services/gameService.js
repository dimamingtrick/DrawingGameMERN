import api from "./api";

class GameService {
  getAllGameWords() {
    return api({ method: "GET", url: "/game/words" });
  }

  getSingleGameWordById(id) {
    return api({ method: "GET", url: "/game/words" + id });
  }

  addNewGameWord(data) {
    return api({ method: "POST", url: "/game/words", body: data });
  }

  updateGameWord(id, data) {
    return api({
      method: "PUT",
      url: "/game/words" + id,
      body: data,
    });
  }

  deleteGameWord(id) {
    return api({ method: "DELETE", url: "/game/words" + id, body: {} });
  }
}

export default new GameService();
