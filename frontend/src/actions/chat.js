import { ChatService } from "../services";

export const GET_ALL_CHATS_SUCCESS = "GET_ALL_CHATS_SUCCESS";
export const CHAT_UPDATE = "CHAT_UPDATE";
export const GET_UNREAD_CHATS_COUNT = "GET_UNREAD_CHATS_COUNT";
export const GET_UNREAD_MESSAGES_COUNT = "GET_UNREAD_MESSAGES_COUNT";
export const CHAT_USER_ONLINE_STATUS = "CHAT_USER_ONLINE_STATUS";
export const ADD_NEW_CHAT_SUCCESS = "ADD_NEW_CHAT_SUCCESS";
export const CHAT_DELETE_SUCCESS = "CHAT_DELETE_SUCCESS";
export const CHAT_LEAVE_SUCCESS = "CHAT_LEAVE_SUCCESS";

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

export const userChangeOnlineStatus = updatedUser => ({
  type: CHAT_USER_ONLINE_STATUS,
  updatedUser,
});

export const chatAddSuccess = newChat => ({
  type: ADD_NEW_CHAT_SUCCESS,
  newChat,
});

export const deleteChat = chatId => async dispatch => {
  try {
    await ChatService.deleteChat(chatId);
    dispatch({ type: CHAT_DELETE_SUCCESS, chatId });
    return "success";
  } catch (err) {
    throw err.message;
  }
};

export const leaveChat = chatId => async dispatch => {
  try {
    await ChatService.leaveChat(chatId);
    dispatch({ type: CHAT_LEAVE_SUCCESS, chatId });
    return "success";
  } catch (err) {
    throw err.message;
  }
}