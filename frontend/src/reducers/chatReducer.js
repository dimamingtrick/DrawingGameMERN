import { GET_ALL_CHATS_SUCCESS } from "../actions/chat";
import { LOGOUT } from "../actions/auth";

const initialState = {
  chats: []
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.chats
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default chatReducer;
