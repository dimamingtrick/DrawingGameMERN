import React from "react";
import { connect } from "react-redux";
import SingleTodoPage from "../SingleTodoPage/SingleTodoPage";
import {
  Spinner,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container
} from "reactstrap";
import { getAllTodos, deleteTodo } from "../../actions/todos";
import { Fade } from "../../components/Animations/RoutingAnimationTransitions";
import { Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

class ToDoListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      load: true,
      isDeleting: false,
      confirmModalIsOpen: false
    };
  }

  componentDidMount() {
    this.props.getAllTodos().then(() => {
      this.setState({ load: false });
    });
  }

  toggleConfirmModal = () => {
    this.setState({ confirmModalIsOpen: !this.state.confirmModalIsOpen });
  };

  deleteTodoRequest = id => {
    this.setState({
      confirmModalIsOpen: true,
      todoId: id
    });
  };

  deleteConfirm = () => {
    this.setState({ isDeleting: true });
    this.props.deleteTodo(this.state.todoId).then(
      res => {
        this.setState({
          confirmModalIsOpen: false,
          isDeleting: false,
          todoId: null
        });
      },
      err => {
        this.setState({ isDeleting: false });
      }
    );
  };

  render() {
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
              onClick={() => this.props.history.push("/app/todolist/add-todo")}
            >
              Add New Todo
            </Button>
          </Col>
        </Row>
        <Row className="todo-row">
          <Col>
            <ListGroup>
              <TransitionGroup>
                {this.props.todoList.map(item => (
                  <CSSTransition
                    key={item._id}
                    classNames="todoRowAnim"
                    timeout={300}
                  >
                    <TodoItem
                      {...item}
                      deleteTodoRequest={this.deleteTodoRequest}
                      onClick={id =>
                        this.props.history.push("/app/todolist/" + id)
                      }
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ListGroup>
          </Col>
        </Row>

        <ConfirmTodoDeleteModal
          confirmModalIsOpen={this.state.confirmModalIsOpen}
          toggleConfirmModal={this.toggleConfirmModal}
          deleteConfirm={this.deleteConfirm}
          isDeleting={this.state.isDeleting}
        />
      </Container>
    );
  }
}

function TodoItem({ _id, title, description, deleteTodoRequest, onClick }) {
  const openListItem = e => {
    if (e.target.tagName !== "SPAN" && e.target.tagName !== "BUTTON") {
      onClick(_id);
    }
  };

  return (
    <ListGroupItem className={"singleTodoListItem"} onClick={openListItem}>
      <Row>
        <Col xs={3}>{title}</Col>
        <Col xs={7}>{description}</Col>
        <Col xs={2}>
          <Button close onClick={() => deleteTodoRequest(_id)} />
        </Col>
      </Row>
    </ListGroupItem>
  );
}

function ConfirmTodoDeleteModal({
  confirmModalIsOpen,
  toggleConfirmModal,
  deleteConfirm,
  isDeleting
}) {
  return (
    <Modal
      isOpen={confirmModalIsOpen}
      toggle={toggleConfirmModal}
      backdrop={isDeleting ? "static" : true}
      modalTransition={{ timeout: 25 }}
      backdropTransition={{ timeout: 25 }}
    >
      <ModalHeader>Delete this todo item ?</ModalHeader>
      <ModalBody>You will not be able to return it</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={deleteConfirm}>
          {isDeleting ? <Spinner size="sm" color="#fff" /> : "Yes"}
        </Button>
        <Button color="danger" onClick={toggleConfirmModal}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default connect(
  store => {
    return {
      todoList: store.todo.todoList
    };
  },
  {
    getAllTodos,
    deleteTodo
  }
)(ToDoListPage);
