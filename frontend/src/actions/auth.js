import { AuthService } from "../services";

export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
export const LOGOUT = "LOGOUT";

export const authenticate = () => async dispatch => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const { user } = await AuthService.authenticate();
    dispatch({ type: AUTH_SUCCESS, user });
  } catch (err) {}
};

export const login = userData => async dispatch => {
  try {
    const { user, token } = await AuthService.login(userData);
    localStorage.setItem("token", token);
    dispatch({ type: AUTH_SUCCESS, user });
  } catch (err) {
    throw err.message;
  }
};

export const registrate = form => async dispatch => {
  try {
    const { user, token } = await AuthService.registrate(form);
    localStorage.setItem("token", token);
    dispatch({ type: REGISTRATION_SUCCESS, user });
  } catch (err) {
    throw err.message;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { type: LOGOUT };
};
