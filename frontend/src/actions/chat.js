import { ChatService } from "../services";

export const GET_ALL_CHATS_SUCCESS = "GET_ALL_CHATS_SUCCESS";
export const CHAT_UPDATE = "CHAT_UPDATE";
export const GET_UNREAD_CHATS_COUNT = "GET_UNREAD_CHATS_COUNT";
export const GET_UNREAD_MESSAGES_COUNT = "GET_UNREAD_MESSAGES_COUNT";

export const getAllChats = () => async dispatch => {
  try {
    const chats = await ChatService.getAllChats();
    dispatch({ type: GET_ALL_CHATS_SUCCESS, chats });
    return chats;
  } catch (err) {
    throw err.message;
  }
};

export const getUnreadChatsCount = unreadChatsCount => ({
  type: GET_UNREAD_CHATS_COUNT,
  unreadChatsCount,
});

export const getUnreadMessagesCount = newUnreadMessages => ({
  type: GET_UNREAD_MESSAGES_COUNT,
  newUnreadMessages,
});

export const updateChat = updatedChat => ({ type: CHAT_UPDATE, updatedChat });
