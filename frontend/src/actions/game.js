import { GameService } from "../services";

export const GET_ALL_WORDS = "GET_ALL_WORDS";
export const ADD_NEW_WORD = "ADD_NEW_WORD";
export const UPDATE_WORD = "UPDATE_WORD";
export const DELETE_WORD = "DELETE_WORD";

export const getAllGameWords = () => async dispatch => {
  try {
    const gameWords = await GameService.getAllGameWords();
    dispatch({ type: GET_ALL_WORDS, gameWords });
  } catch (err) {
    throw err;
  }
};

export const addNewGameWord = data => async dispatch => {
  try {
    const newWord = await GameService.addNewGameWord(data);
    dispatch({ type: ADD_NEW_WORD, newWord });
  } catch (err) {
    throw err.message;
  }
};

export const updateGameWord = (id, data) => async dispatch => {
  try {
    const updatedWord = await GameService.updateGameWord(id, data);
    dispatch({ type: UPDATE_WORD, updatedWord });
  } catch (err) {
    throw err.message;
  }
};

export const deleteGameWord = id => async dispatch => {
  try {
    await GameService.deleteGameWord(id);
    dispatch({ type: DELETE_WORD, gameWordId: id });
  } catch (err) {
    throw err;
  }
};
