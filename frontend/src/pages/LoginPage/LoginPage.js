import React, { Component } from "react";
import { connect } from "react-redux";
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
import { login } from "../../actions/auth";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: "",
      loginError: "",
      password: "",
      passwordError: "",
      authError: "",
      load: false
    };
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  login = () => {
    const { login, password } = this.state;

    let errors = {
      ...(login === "" ? { loginError: "Login is required" } : {}),
      ...(password === ""
        ? { passwordError: "Password length must be at least 5" }
        : {})
    };

    if (Object.keys(errors).length > 0) {
      this.setState(errors);
      return;
    }

    this.setState({
      load: true,
      ...(this.state.loginError !== "" ? { loginError: "" } : {}),
      ...(this.state.passwordError !== "" ? { passwordError: "" } : {}),
      ...(this.state.authError !== "" ? { authError: "" } : {})
    });

    this.props
      .login({
        login: this.state.login,
        password: this.state.password
      })
      .then(res => {
        this.props.history.push("/app/game");
      })
      .catch(err => {
        this.setState({
          load: false,
          authError: err
        });
      });
  };

  render() {
    const {
      login,
      password,
      load,
      loginError,
      passwordError,
      authError
    } = this.state;
    return (
      <Container className="auth-page-container">
        <Col sm={{ size: 6, offset: 3 }}>
          <h3>Sign In</h3>
          <Form>
            <FormGroup row>
              <Label for="loginInputLogin" sm={2}>
                Login
              </Label>
              <Col sm={12}>
                <Input
                  invalid={loginError !== ""}
                  value={login}
                  onChange={this.handleInput}
                  type="login"
                  name="login"
                  id="loginInputLogin"
                  placeholder="Login..."
                />
                <FormText>
                  <div className="auth-error">{loginError}</div>
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="passwordInputLogin" sm={2}>
                Password
              </Label>
              <Col sm={12}>
                <Input
                  invalid={passwordError !== ""}
                  value={password}
                  onChange={this.handleInput}
                  type="password"
                  name="password"
                  id="passwordInputLogin"
                  placeholder="Password..."
                />
                <FormText>
                  <div className="auth-error">{passwordError}</div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col xs={12}>
                <FormText>
                  <div className="auth-error main-auth-error">{authError}</div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup check row>
              <Col sm={{ size: 10, offset: 1 }}>
                <Button
                  onClick={this.login}
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
  { login }
)(LoginPage);
