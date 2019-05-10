import React, { Component } from "react";
import { connect } from "react-redux";
import { registrate } from "../../actions/auth";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  FormText,
  Container
} from "reactstrap";

class RegistrationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        login: "",
        email: "",
        password: ""
      },
      registrationError: {
        login: "",
        email: "",
        password: "",
        mainError: ""
      },
      load: false
    };
  }

  // Save input data to form state and clear its error if it exists
  handleInput = ({ target: { name, value } }) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: value
      },
      registrationError: {
        ...this.state.registrationError,
        ...(this.state.registrationError[name] !== "" ? { [name]: "" } : {})
      }
    });
  };

  registrate = () => {
    this.setState({
      load: true,
      registrationError: { ...this.state.registrationError, mainError: "" }
    });

    this.props.registrate(this.state.form).then(
      res => {
        this.props.history.push("/app/game");
      },
      errors => {
        this.setState({
          load: false,
          registrationError: {
            ...this.state.registrationError,
            ...errors
          }
        });
      }
    );
  };

  submitButtonIsDisabled = () => {
    const { registrationError, load } = this.state;

    return load ||
      registrationError.login !== "" ||
      registrationError.email !== "" ||
      registrationError.password !== ""
      ? true
      : false;
  };

  render() {
    const {
      form: { login, email, password },
      registrationError,
      load
    } = this.state;

    return (
      <Container className="auth-page-container">
        <Col sm={{ size: 6, offset: 3 }}>
          <h3>Registration</h3>
          <Form>
            <FormGroup row>
              <Label for="loginInput" sm={2}>
                Login
              </Label>
              <Col sm={12}>
                <Input
                  value={login}
                  onChange={this.handleInput}
                  type="text"
                  name="login"
                  id="loginInput"
                  placeholder="Login..."
                />
                <FormText>
                  <div className="auth-error main-auth-error">
                    {registrationError.login}
                  </div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="emailInput" sm={2}>
                Email
              </Label>
              <Col sm={12}>
                <Input
                  value={email}
                  onChange={this.handleInput}
                  type="email"
                  name="email"
                  id="emailInput"
                  placeholder="Email..."
                />
                <FormText>
                  <div className="auth-error main-auth-error">
                    {registrationError.email}
                  </div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="passwordInput" sm={2}>
                Password
              </Label>
              <Col sm={12}>
                <Input
                  value={password}
                  onChange={this.handleInput}
                  type="password"
                  name="password"
                  id="passwordInput"
                  placeholder="Password..."
                />
                <FormText>
                  <div className="auth-error main-auth-error">
                    {registrationError.password || registrationError.mainError}
                  </div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup check row>
              <Col sm={{ size: 12, offset: 1 }}>
                <Button
                  disabled={this.submitButtonIsDisabled()}
                  onClick={this.registrate}
                  style={{
                    width: 200,
                    height: 50
                  }}
                >
                  {load ? <Spinner /> : "Submit"}
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Container>
    );
  }
}

export default connect(
  null,
  { registrate }
)(RegistrationPage);
