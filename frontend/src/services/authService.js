import api from "./api";

class AuthService {
  authenticate() {
    return api({
      method: "GET",
      url: "/me"
    });
  }

  login(body) {
    return api({
      method: "POST",
      url: "/login",
      body
    });
  }

  registrate(body) {
    return api({
      method: "POST",
      url: "/registration",
      body
    });
  }

  updateProfile(body) {
    return api({
      method: "PUT",
      url: "/profile",
      body
    });
  }
}

export default new AuthService();
