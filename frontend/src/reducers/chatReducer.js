import {
  GET_ALL_CHATS_SUCCESS,
  CHAT_UPDATE,
  GET_UNREAD_MESSAGES_COUNT,
  GET_UNREAD_CHATS_COUNT,
  CHAT_USER_ONLINE_STATUS,
  ADD_NEW_CHAT_SUCCESS,
  CHAT_DELETE_SUCCESS,
  CHAT_LEAVE_SUCCESS,
  INVITE_TO_CHAT_SUCCESS,
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
    case INVITE_TO_CHAT_SUCCESS:
      return {
        ...state,
        chats: state.chats.map(i => {
          if (i._id === action.updatedChat._id) return action.updatedChat;
          return i;
        }),
      };

    case LOGOUT:
      return initialState;

    case CHAT_USER_ONLINE_STATUS:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.users.find(u => u._id === action.updatedUser._id)) {
            chat.users = chat.users.map(u => {
              if (u._id === action.updatedUser._id) return action.updatedUser;
              return u;
            });
          }
          return chat;
        }),
      };

    case ADD_NEW_CHAT_SUCCESS:
      return {
        ...state,
        chats: [action.newChat, ...state.chats],
      };

    case CHAT_DELETE_SUCCESS:
    case CHAT_LEAVE_SUCCESS:
      return {
        ...state,
        chats: state.chats.filter(i => i._id !== action.chatId),
      };

    default:
      return state;
  }
};

export default chatReducer;
