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
} from "reactstrap";

class RegistrationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        login: "",
        email: "",
        password: "",
      },
      load: false,
      registrationError: "",
    };
  }

  handleInput = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  registrate = () => {
    this.setState({
      load: true,
      ...(this.state.registrationError !== "" ? { registrationError: "" } : {}),
    });
    this.props.registrate(this.state.form).then(
      res => {
        this.props.history.push("/app");
      },
      err => {
        this.setState({ load: false, registrationError: err });
      }
    );
  };

  render() {
    const {
      form: { login, email, password },
      load,
      registrationError,
    } = this.state;
    return (
      <div>
        <br />
        <br />
        <br />
        <Col sm={{ size: 6, offset: 3 }}>
          <h3>Registration</h3>
          <Form>
            <FormGroup row>
              <Label for="loginInput" sm={2}>
                Login
              </Label>
              <Col sm={12}>
                <Input
                  required
                  value={login}
                  onChange={this.handleInput}
                  type="text"
                  name="login"
                  id="loginInput"
                  placeholder="Login..."
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="emailInput" sm={2}>
                Email
              </Label>
              <Col sm={12}>
                <Input
                  required
                  value={email}
                  onChange={this.handleInput}
                  type="email"
                  name="email"
                  id="emailInput"
                  placeholder="Email..."
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="passwordInput" sm={2}>
                Password
              </Label>
              <Col sm={12}>
                <Input
                  required
                  value={password}
                  onChange={this.handleInput}
                  type="password"
                  name="password"
                  id="passwordInput"
                  placeholder="Password..."
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col xs={12}>
                <FormText>
                  <div className="auth-error main-auth-error">
                    {registrationError}
                  </div>
                </FormText>
              </Col>
            </FormGroup>

            <FormGroup check row>
              <Col sm={{ size: 12, offset: 1 }}>
                <Button
                  onClick={this.registrate}
                  style={{
                    width: 200,
                    height: 50,
                  }}
                >
                  {load ? <Spinner /> : "Submit"}
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </div>
    );
  }
}

export default connect(
  null,
  { registrate }
)(RegistrationPage);
