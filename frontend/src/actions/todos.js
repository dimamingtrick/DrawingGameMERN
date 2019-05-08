import { TodoService } from "../services";

export const GET_ALL_TODOS = "GET_ALL_TODOS";
export const ADD_NEW_TODO = "ADD_NEW_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const DELETE_TODO = "DELETE_TODO";

export const getAllTodos = () => async dispatch => {
  try {
    const todoList = await TodoService.getAllTodos();
    dispatch({ type: GET_ALL_TODOS, todoList });
  } catch (err) {
    throw err;
  }
};

export const addNewTodo = data => async dispatch => {
  try {
    const newTodo = await TodoService.addNewTodo(data);
    dispatch({ type: ADD_NEW_TODO, newTodo });
  } catch (err) {
    throw err.message;
  }
};

export const updateTodo = (id, data) => async dispatch => {
  try {
    const updatedTodo = await TodoService.updateTodo(id, data);
    dispatch({ type: UPDATE_TODO, updatedTodo });
  } catch (err) {
    throw err.message;
  }
};

export const deleteTodo = id => async dispatch => {
  try {
    await TodoService.deleteTodo(id);
    dispatch({ type: DELETE_TODO, todoId: id });
  } catch (err) {
    throw err;
  }
};
