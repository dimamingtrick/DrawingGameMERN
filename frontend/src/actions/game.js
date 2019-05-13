import { GameService } from "../services";

export const GET_ALL_GAME_SETTINGS = "GET_ALL_GAME_SETTINGS";
export const GET_ALL_WORDS = "GET_ALL_WORDS";
export const ADD_NEW_WORD = "ADD_NEW_WORD";
export const DELETE_WORD = "DELETE_WORD";

export const getGameSettings = () => async dispatch => {
  try {
    const { settings: gameSettings } = await GameService.getGameSettings();
    dispatch({ type: GET_ALL_GAME_SETTINGS, gameSettings });
  } catch (err) {
    throw err;
  }
};

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

export const deleteGameWord = id => async dispatch => {
  try {
    await GameService.deleteGameWord(id);
    dispatch({ type: DELETE_WORD, gameWordId: id });
  } catch (err) {
    throw err;
  }
};
