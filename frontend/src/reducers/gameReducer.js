import {
  GET_ALL_GAME_SETTINGS,
  GET_ALL_WORDS,
  ADD_NEW_WORD,
  DELETE_WORD
} from "../actions/game";
import { LOGOUT } from "../actions/auth";

const initialState = {
  gameSettings: {},
  gameWords: []
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_GAME_SETTINGS:
      return {
        ...state,
        gameSettings: action.gameSettings
      };

    case GET_ALL_WORDS:
      return {
        ...state,
        gameWords: action.gameWords
      };

    case ADD_NEW_WORD:
      return {
        ...state,
        gameWords: [...state.gameWords, action.newWord]
      };

    case DELETE_WORD:
      return {
        ...state,
        gameWords: state.gameWords.filter(i => i._id !== action.gameWordId)
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default gameReducer;
