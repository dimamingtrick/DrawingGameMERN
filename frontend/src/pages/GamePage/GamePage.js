import React from "react";
import { connect } from "react-redux";
import { Container, Card, Row, Col } from "reactstrap";
import GameCanvas from "../../components/GameCanvas/GameCanvas";
// import { ChatService } from "../../services"; // gonna use for getting game settings (current word to guess or drawer user)
import { socket } from "../DashboardContainer/DashboardContainer";
import {
  ChatMessagesContainer,
  SingleMessage,
  ChatInput,
} from "../../components/GameChat";
import { GameReloadingSpinner } from "../../components/Game";
import "./game-page.css";

class GamePage extends React.Component {
  state = {
    messages: [],
    inputMessage: "",
    sending: false,
    gameIsLoading: false,
  };

  componentDidMount() {
    const dashboardWrapper = document.querySelector("div.dashboard-wrapper"); // Disable container vertical scrolling and set scroll position to 0
    dashboardWrapper.scrollTop = 0;
    dashboardWrapper.style.overflowY = "hidden";

    socket.emit("gameChatConnectRequest", { user: this.props.user.login });
    socket.on("newGameChatMessage", this.setNewMessage);
    socket.on("disconnect", this.startGameLoading);
    socket.on("connect", this.stopGameLoading);
    socket.on("gameLoadingStart", this.startGameLoading);
    socket.on("gameLoadingStop", this.stopGameLoading);
  }

  componentWillUnmount() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("newGameChatMessage");
    socket.off("gameLoadingStart");
    socket.off("gameLoadingStop");
    socket.emit("gameChatDisconnectRequest", { user: this.props.user.login });
    document.querySelector("div.dashboard-wrapper").style.overflowY = "auto"; // Enable container vertical scrolling
  }

  startGameLoading = () => {
    this.setState({ gameIsLoading: true });
  };

  stopGameLoading = () => {
    if (this.state.gameIsLoading) this.setState({ gameIsLoading: false });
  };

  setNewMessage = ({ newMessage }) => {
    this.setState(
      {
        messages: [...this.state.messages, newMessage],
        ...(newMessage.user === this.props.user.login && this.state.sending // set this state if user was sending message for better screen transition
          ? {
              inputMessage: "",
              sending: false,
            }
          : {}),
      },
      () => {
        this.scrollToChatBottom();
      }
    );
  };

  scrollToChatBottom = () => {
    const chatMessagesWrapper = document.querySelector(".chat-messages");
    chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
  };

  /** I'm not saving game messages to database, so i can just emit socket events to backend */
  sendMessage = () => {
    if (this.state.inputMessage === "" || this.state.sending) return;
    this.setState({ sending: true });
    socket.emit("sendNewGameChatMessage", {
      message: this.state.inputMessage,
      userId: this.props.user._id,
    });
  };

  handleInput = e => {
    this.setState({
      inputMessage: e.target.value,
    });
  };

  render() {
    const { messages, sending, inputMessage, gameIsLoading } = this.state;
    const { user } = this.props;
    return (
      <Container fluid id="game-page-container">
        {gameIsLoading && <GameReloadingSpinner />}

        <Row>
          <Col xs={6} sm={8}>
            <Card body className="game-card drawing-card">
              <GameCanvas user={user} />
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
    user: store.auth.user,
  };
})(GamePage);
