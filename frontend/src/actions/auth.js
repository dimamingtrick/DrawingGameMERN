import api from "../services/api";

export const authenticate = () => async dispatch => {
  try {
    const { user, token } = await api({
      method: "GET",
      url: "/me",
    });

    localStorage.setItem("token", token);
    dispatch({ type: "AUTH_SUCCESS", user });
  } catch (err) {
    throw err.message;
  }
};

export const login = userData => async dispatch => {
  try {
    const { user, token } = await api({
      method: "POST",
      url: "/login",
      body: userData,
    });
    localStorage.setItem("token", token);
    dispatch({ type: "AUTH_SUCCESS", user });
  } catch (err) {
    throw err.message;
  }
};

export const registrate = form => async dispatch => {
  try {
    const { user, token } = await api({
      method: "POST",
      url: "/registration",
      body: form,
    });
    localStorage.setItem("token", token);
    dispatch({ type: "REGISTRATION_SUCCESS", user });
  } catch (err) {
    throw err.message;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { type: "LOGOUT" };
};
