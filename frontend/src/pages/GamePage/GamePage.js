import React from "react";
import { connect } from "react-redux";
import { Container, Card, Row, Col } from "reactstrap";
import Canvas from "../../components/Canvas/Canvas";
import { ChatService } from "../../services";
import { socket } from "../DashboardContainer/DashboardContainer";
import {
  ChatMessagesContainer,
  SingleMessage,
  ChatInput
} from "../../components/GameChat";
import "./game-page.css";

class GamePage extends React.Component {
  state = {
    messages: [],
    inputMessage: "",
    sending: false
  };

  componentDidMount() {
    const dashboardWrapper = document.querySelector("div.dashboard-wrapper"); // Disable container vertical scrolling and set scroll position to 0
    dashboardWrapper.scrollTop = 0;
    dashboardWrapper.style.overflowY = "hidden";

    ChatService.getAllMessages().then(
      messages => {
        this.setState(
          {
            messages
          },
          () => {
            socket.emit("chatConnectRequest", { user: this.props.user.login });
            socket.on("newMessage", this.setNewMessage);
          }
        );
        this.scrollToChatBottom();
      },
      err => {
        console.log("err get chat", err);
      }
    );
  }

  componentWillUnmount() {
    socket.off("newDraw");
    socket.off("newMessage");
    socket.emit("chatDisconnectRequest", { user: this.props.user.login });
    document.querySelector("div.dashboard-wrapper").style.overflowY = "auto"; // Enable container vertical scrolling
  }

  setNewMessage = ({ newMessage }) => {
    this.setState({ messages: [...this.state.messages, newMessage] }, () => {
      this.scrollToChatBottom();
    });
  };

  scrollToChatBottom = () => {
    const chatMessagesWrapper = document.querySelector(".chat-messages");
    chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
  };

  sendMessage = () => {
    if (this.state.inputMessage === "") return;
    this.setState({ sending: true });
    ChatService.sendNewMessage(this.state.inputMessage).then(
      res => {
        this.setState({
          inputMessage: "",
          sending: false
        });
      },
      err => {
        this.setState({ sending: false });
        console.log("ERR", err);
      }
    );
  };

  handleInput = e => {
    this.setState({
      inputMessage: e.target.value
    });
  };

  render() {
    const { messages, sending, inputMessage } = this.state;
    const { user } = this.props;
    return (
      <Container fluid id="game-page-container">
        <Row>
          <Col xs={6} sm={8}>
            <Card body className="game-card drawing-card">
              <Canvas user={user} />
            </Card>
          </Col>

          <Col xs={6} md={4}>
            <Card body className="game-card chat-card">
              <ChatMessagesContainer>
                {messages.map((msg, index) => (
                  <SingleMessage
                    key={msg._id ? msg._id : "otherType-" + index}
                    message={msg}
                    userLogin={user.login}
                  />
                ))}
              </ChatMessagesContainer>
              <ChatInput
                inputMessage={inputMessage}
                handleInput={this.handleInput}
                sendMessage={this.sendMessage}
                sending={sending}
              />
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(store => {
  return {
    user: store.auth.user
  };
})(GamePage);
