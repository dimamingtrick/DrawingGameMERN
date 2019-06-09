import {
  GET_ALL_CHATS_SUCCESS,
  CHAT_UPDATE,
  GET_UNREAD_MESSAGES_COUNT,
  GET_UNREAD_CHATS_COUNT,
} from "../actions/chat";
import { LOGOUT } from "../actions/auth";

const initialState = {
  unreadChatsCount: 0,
  chats: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNREAD_CHATS_COUNT:
      return {
        ...state,
        unreadChatsCount: action.unreadChatsCount,
      };

    case GET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat._id === action.newUnreadMessages.chatId)
            chat.unreadMessagesCount =
              action.newUnreadMessages.unreadMessagesCount;
          return chat;
        }),
      };

    case GET_ALL_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.chats,
      };

    case CHAT_UPDATE:
      return {
        ...state,
        chats: state.chats.map(i => {
          if (i._id === action.updatedChat._id) return action.updatedChat;
          return i;
        }),
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default chatReducer;
