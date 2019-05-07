import {
  GET_ALL_TODOS,
  ADD_NEW_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from "../actions/todos";
import { LOGOUT } from "../actions/auth";

const initialState = {
  todoList: [],
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TODOS:
      return {
        ...state,
        todoList: action.todoList,
      };

    case ADD_NEW_TODO:
      return {
        ...state,
        todoList: [...state.todoList, action.newTodo],
      };

    case UPDATE_TODO:
      return {
        ...state,
        todoList: state.todoList.map(i => {
          if (i._id === action.updatedTodo._id) i = action.updatedTodo;
          return i;
        }),
      };

    case DELETE_TODO:
      return {
        ...state,
        todoList: state.todoList.filter(i => i._id !== action.todoId),
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default todoReducer;
