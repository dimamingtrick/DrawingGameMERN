import api from "./api";

class TodoService {
  getAllTodos() {
    return api({ method: "GET", url: "/todo" });
  }

  getSingleTodoById(id) {
    return api({ method: "GET", url: "/todo/" + id });
  }

  addNewTodo(data) {
    return api({ method: "POST", url: "/todo", body: data });
  }

  updateTodo(id, data) {
    return api({
      method: "PUT",
      url: "/todo/" + id,
      body: data,
    });
  }

  deleteTodo(id) {
    return api({ method: "DELETE", url: "/todo/" + id, body: {} });
  }
}

export default new TodoService();
