import { combineReducers } from "redux";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import todoReducer from "./todoReducer";
import gameReducer from "./gameReducer";

export default combineReducers({
  auth: authReducer,
  todo: todoReducer,
  chat: chatReducer,
  game: gameReducer,
});
