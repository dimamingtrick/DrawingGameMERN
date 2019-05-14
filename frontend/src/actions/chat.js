import { ChatService } from "../services";

export const GET_ALL_CHATS_SUCCESS = "GET_ALL_CHATS_SUCCESS";

export const getAllChats = () => async dispatch => {
  try {
    const chats = await ChatService.getAllChats();
    dispatch({ type: GET_ALL_CHATS_SUCCESS, chats });
    return chats;
  } catch (err) {
    console.log(err);
    throw err.message;
  }
};
