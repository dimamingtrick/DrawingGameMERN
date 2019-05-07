import api from "./api";

class AuthService {
  authenticate() {
    return api({
      method: "GET",
      url: "/me",
    });
  }

  login(userData) {
    return api({
      method: "POST",
      url: "/login",
      body: userData,
    });
  }

  registrate(form) {
    return api({
      method: "POST",
      url: "/registration",
      body: form,
    });
  }
}

export default new AuthService();
