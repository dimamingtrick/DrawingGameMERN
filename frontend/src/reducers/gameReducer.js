import {
  GET_ALL_WORDS,
  ADD_NEW_WORD,
  UPDATE_WORD,
  DELETE_WORD,
} from "../actions/game";
import { LOGOUT } from "../actions/auth";

const initialState = {
  gameWords: [],
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_WORDS:
      return {
        ...state,
        gameWords: action.gameWords,
      };

    case ADD_NEW_WORD:
      return {
        ...state,
        gameWords: [...state.gameWords, action.newWord],
      };

    case UPDATE_WORD:
      return {
        ...state,
        gameWords: state.gameWords.map(i => {
          if (i._id === action.updatedWord._id) i = action.updatedWord;
          return i;
        }),
      };

    case DELETE_WORD:
      return {
        ...state,
        gameWords: state.gameWords.filter(i => i._id !== action.gameWordId),
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default gameReducer;
