import {
  AUTH_SUCCESS,
  REGISTRATION_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  LOGOUT
} from "../actions/auth";

const initialState = {
  isLoggedIn: false,
  user: {}
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        isLoggedIn: true,
        user: action.user
      };

    case REGISTRATION_SUCCESS:
      return {
        isLoggedIn: true,
        user: action.user
      };

    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        user: action.user
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
