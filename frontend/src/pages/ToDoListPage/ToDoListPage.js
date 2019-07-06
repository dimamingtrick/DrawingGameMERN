import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Row, Col, ListGroup, Button, Container } from "reactstrap";
import SingleTodoPage from "./SingleTodoPage/SingleTodoPage";
import { Fade } from "../../components/Animations/RoutingAnimationTransitions";
import { TodoItem } from "../../components/TodoList";
import { ConfirmModal } from "../../components/Modals";
import { getAllTodos, deleteTodo } from "../../actions/todos";
import { mainStateHook } from "../../hooks";

const ToDoListPage = ({ getAllTodos, todoList, deleteTodo, history }) => {
  const [state, setState] = mainStateHook({
    load: true,
    isDeleting: false,
    confirmModalIsOpen: false,
    todoId: null,
  });

  const fetchAllTodos = () => {
    getAllTodos().then(() => {
      setState({ load: false });
    });
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const toggleConfirmModal = () => {
    setState({ confirmModalIsOpen: !state.confirmModalIsOpen });
  };

  const deleteTodoRequest = id => {
    setState({
      confirmModalIsOpen: true,
      todoId: id,
    });
  };

  const deleteConfirm = () => {
    setState({ isDeleting: true });
    deleteTodo(state.todoId).then(
      res => {
        setState({
          confirmModalIsOpen: false,
          isDeleting: false,
          todoId: null,
        });
      },
      err => {
        setState({ isDeleting: false });
      }
    );
  };

  return (
    <Container>
      <Route
        path={"/app/todolist/:id"}
        children={navProps => Fade(SingleTodoPage, navProps)}
      />

      <h1>To Do List</h1>
      <Row className="todo-row">
        <Col md={{ size: 10, offset: 1 }}>
          <Button
            color="primary"
            onClick={() => history.push("/app/todolist/add-todo")}
          >
            Add New Todo
          </Button>
        </Col>
      </Row>
      <Row className="todo-row">
        <Col>
          <ListGroup>
            <TransitionGroup>
              {todoList.map(item => (
                <CSSTransition
                  key={item._id}
                  classNames="todoRowAnim"
                  timeout={300}
                >
                  <TodoItem
                    {...item}
                    deleteTodoRequest={deleteTodoRequest}
                    onClick={id => history.push("/app/todolist/" + id)}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>
        </Col>
      </Row>

      <ConfirmModal
        isOpen={state.confirmModalIsOpen}
        toggle={toggleConfirmModal}
        deleteConfirming={deleteConfirm}
        isDeleting={state.isDeleting}
        headerText="Delete this todo item ?"
        bodyText="You will not be able to return it"
      />
    </Container>
  );
};

export default connect(
  store => {
    return {
      todoList: store.todo.todoList,
    };
  },
  {
    getAllTodos,
    deleteTodo,
  }
)(ToDoListPage);
