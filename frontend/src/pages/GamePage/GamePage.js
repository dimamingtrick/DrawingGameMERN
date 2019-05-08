import React from "react";
import { connect } from "react-redux";
import {
  Container,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon
} from "reactstrap";
import moment from "moment";
import "./game-page.css";
import { IoMdSend } from "react-icons/io";
import chatbg from "../../assets/chatbg.png";

class GamePage extends React.Component {
  state = {
    messages: [
      {
        user: "User 1",
        message: "First initial message",
        createdAt: new Date()
      },
      {
        user: "admin@gmail.com",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "login2",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "admin@gmail.com",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "login2",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "login2",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "admin@gmail.com",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "login2",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "admin@gmail.com",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "admin@gmail.com",
        message: "Second initial message",
        createdAt: new Date()
      },
      {
        user: "login2",
        message: "Second initial message",
        createdAt: new Date()
      }
    ],
    inputMessage: ""
  };

  componentDidMount() {
    this.scrollToChatBottom();
  }

  scrollToChatBottom = () => {
    const chatMessagesWrapper = document.querySelector(".chat-messages");
    chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
  };

  sendMessage = () => {
    this.setState(
      {
        messages: [
          ...this.state.messages,
          {
            user: this.props.user.login,
            message: this.state.inputMessage,
            createdAt: new Date()
          }
        ],
        inputMessage: ""
      },
      () => {
        this.scrollToChatBottom();
      }
    );
  };

  handleInput = e => {
    this.setState({
      inputMessage: e.target.value
    });
  };

  render() {
    const { messages } = this.state;
    const { user } = this.props;
    return (
      <Container fluid id="game-page-container">
        <Row>
          <Col xs={6} sm={8}>
            <Card body className="game-card drawing-card">
              <CardTitle>Game Draw Panel</CardTitle>
              <CardText>There will be canvas drawing panel</CardText>
              <Button>Some react canvas draw library</Button>
            </Card>
          </Col>

          <Col xs={6} md={4}>
            <Card body className="game-card chat-card">
              <div
                className="chat-messages"
                style={{
                  background: 'url("' + chatbg + '")'
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    className={`single-message ${
                      msg.user === user.login ? "my-message" : ""
                    }`}
                    key={i}
                  >
                    <div className="message-wrapper">
                      {msg.user === user.login ? null : (
                        <div className="single-message-user">{msg.user}</div>
                      )}
                      <div className="single-message-text">{msg.message}</div>
                      <div className="single-message-date">
                        {moment(msg.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <InputGroup>
                <Input
                  value={this.state.inputMessage}
                  onChange={this.handleInput}
                  placeholder="Message..."
                  onKeyDown={e => {
                    if (e.keyCode === 13) this.sendMessage();
                  }}
                />
                <InputGroupAddon addonType="append">
                  <Button onClick={this.sendMessage}>
                    <IoMdSend />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  store => {
    return {
      user: store.auth.user
    };
  },
  {}
)(GamePage);
