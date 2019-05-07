import { combineReducers } from "redux";
import authReducer from "./authReducer";
import chatReducer from "./chatReducer";
import todoReducer from "./todoReducer";

export default combineReducers({
  auth: authReducer,
  todo: todoReducer,
  chat: chatReducer,
});
