import api from "../services/api";

export const getAllTodos = () => async dispatch => {
  try {
    const todoList = await api({ method: "GET", url: "/todo" });
    dispatch({ type: "GET_ALL_TODOS", todoList });
  } catch (err) {
    throw err;
  }
};

export const addNewTodo = data => async dispatch => {
  try {
    const newTodo = await api({ method: "POST", url: "/todo", body: data });
    dispatch({ type: "ADD_NEW_TODO", newTodo });
  } catch (err) {
    throw err;
  }
};

export const updateTodo = (id, data) => async dispatch => {
  try {
    const updatedTodo = await api({
      method: "PUT",
      url: "/todo/" + id,
      body: data,
    });
    dispatch({ type: "UPDATE_TODO", updatedTodo });
  } catch (err) {
    throw err;
  }
};

export const deleteTodo = id => async dispatch => {
  try {
    await api({ method: "DELETE", url: "/todo/" + id, body: {} });
    dispatch({ type: "DELETE_TODO", todoId: id });
  } catch (err) {
    throw err;
  }
};
