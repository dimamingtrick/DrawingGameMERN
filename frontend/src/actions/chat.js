import { ChatService } from "../services";

export const GET_ALL_CHATS_SUCCESS = "GET_ALL_CHATS_SUCCESS";
export const CHAT_UPDATE = "CHAT_UPDATE";
export const GET_UNREAD_MESSAGES_COUNT = "GET_UNREAD_MESSAGES_COUNT";

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

export const getUnreadMessagesCount = unreadMessagesCount => ({
  type: GET_UNREAD_MESSAGES_COUNT,
  unreadMessagesCount,
});

export const updateChat = updatedChat => ({ type: CHAT_UPDATE, updatedChat });
