import React, { Component } from "react";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Spinner
} from "reactstrap";
import api from "../../services/api";
import { addNewTodo, updateTodo } from "../../actions/todos";
import { connect } from "react-redux";

class SingleTodoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreation: this.props.match.params.id === "add-todo",
      load: true,
      submitLoading: false,
      form: {
        title: "",
        description: ""
      }
    };
  }

  handleInput = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  };

  componentDidMount() {
    if (!this.state.isCreation) {
      api({ method: "GET", url: "/todo/" + this.props.match.params.id }).then(
        ({ title, description }) => {
          this.setState({
            load: false,
            form: {
              title,
              description
            }
          });
        }
      );
    } else {
      this.setState({ load: false });
    }
  }

  addNewTodo = async () => {
    try {
      this.setState({ submitLoading: true });
      if (this.state.isCreation) {
        await this.props.addNewTodo(this.state.form);
      } else {
        await this.props.updateTodo(
          this.props.match.params.id,
          this.state.form
        );
      }
      this.goBack();
    } catch (err) {
      this.setState({ submitLoading: false });
    }
  };

  goBack = () => {
    this.props.history.push("/app/todolist");
  };

  render() {
    const { title, description } = this.state.form;
    const { load, submitLoading } = this.state;

    return (
      <div className="todoListModalWrapper">
        <div className="todoListBg" onClick={this.goBack} />
        <Col md={6} xs={10} className="todolistModalCol">
          <div className="todolistModal">
            <Row form>
              <Col sm="12">
                {load ? (
                  <Spinner style={{ width: "3rem", height: "3rem" }} />
                ) : (
                  <Form>
                    <h3>Add Todo</h3>
                    <FormGroup row>
                      <Label for="titleInput" sm={2}>
                        Title
                      </Label>
                      <Col sm={10}>
                        <Input
                          value={title}
                          onChange={this.handleInput}
                          type="text"
                          name="title"
                          id="titleInput"
                          placeholder="To do title"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="descriptionInput" sm={2}>
                        Description
                      </Label>
                      <Col sm={10}>
                        <Input
                          value={description}
                          onChange={this.handleInput}
                          type="text"
                          name="description"
                          id="descriptionInput"
                          placeholder="To do description"
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup check row>
                      <Col sm={{ size: 10, offset: 1 }}>
                        <Button
                          onClick={this.addNewTodo}
                          style={{
                            width: 200,
                            height: 50
                          }}
                        >
                          {submitLoading ? <Spinner /> : "Submit"}
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </div>
    );
  }
}

export default connect(
  null,
  { addNewTodo, updateTodo }
)(SingleTodoPage);
