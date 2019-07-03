import api from "./api";

class UserService {
  getAllUsers() {
    return api({
      method: "GET",
      url: "/users",
    });
  }
}

export default new UserService();
