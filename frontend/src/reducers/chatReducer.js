import {
  GET_ALL_CHATS_SUCCESS,
  CHAT_UPDATE,
  GET_UNREAD_MESSAGES_COUNT,
} from "../actions/chat";
import { LOGOUT } from "../actions/auth";

const initialState = {
  unreadMessagesCount: 0,
  chats: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadMessagesCount: action.unreadMessagesCount,
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
