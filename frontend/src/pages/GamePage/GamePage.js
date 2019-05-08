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
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { ChatService } from "../../services";
import moment from "moment";
import "./game-page.css";
import { IoMdSend } from "react-icons/io";
import chatbg from "../../assets/chatbg.png";
import socketIOClient from "socket.io-client";

const serverUrl = `${process.env.REACT_APP_SERVER}/`;
let socket;

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      inputMessage: "",
      sending: false,
    };
    socket = socketIOClient(serverUrl);
  }

  componentDidMount() {
    socket.on("socketWorks", ({ horray }) => console.log(horray)); // Check if socket works
    socket.on("newMessage", this.setNewMessage);
    ChatService.getAllMessages().then(
      messages => {
        this.setState({
          messages,
        });
        this.scrollToChatBottom();
      },
      err => {
        console.log("err get chat", err);
      }
    );
  }
  componentWillUnmount() {
    socket.off("newMessage");
  }

  setNewMessage = ({ newMessage }) => {
    this.setState(
      {
        messages: [...this.state.messages, newMessage],
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

  sendMessage = () => {
    if (this.state.inputMessage === "") return;
    this.setState({ sending: true });
    ChatService.sendNewMessage(this.state.inputMessage).then(
      res => {
        this.setState({
          inputMessage: "",
          sending: false,
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
      inputMessage: e.target.value,
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
              <CardTitle>Game Draw Panel</CardTitle>
              <CardText>There will be canvas drawing panel</CardText>
              <Button>Some react canvas draw library</Button>
            </Card>
          </Col>

          <Col xs={6} md={4}>
            <Card body className="game-card chat-card">
              <ChatMessagesContainer>
                {messages.map(msg => (
                  <SingleMessage
                    key={msg._id}
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

function ChatMessagesContainer({ children }) {
  return (
    <div
      className="chat-messages"
      style={{
        background: 'url("' + chatbg + '")',
      }}
    >
      {children}
    </div>
  );
}

function SingleMessage({ message, userLogin }) {
  return (
    <div
      className={`single-message ${
        message.user === userLogin ? "my-message" : ""
      }`}
    >
      <div className="message-wrapper">
        {message.user !== userLogin && (
          <div className="single-message-user">{message.user}</div>
        )}
        <div className="single-message-text">{message.message}</div>
        <div className="single-message-date">
          {moment(message.createdAt).format("HH:mm:ss DD/MM/YYYY")}
        </div>
      </div>
    </div>
  );
}

function ChatInput({ inputMessage, handleInput, sendMessage, sending }) {
  return (
    <InputGroup>
      <Input
        value={inputMessage}
        onChange={handleInput}
        className="chat-input"
        placeholder="Message..."
        onKeyDown={e => {
          if (e.keyCode === 13) sendMessage();
        }}
      />
      <InputGroupAddon addonType="append">
        <Button
          disabled={inputMessage === ""}
          className="input-submit-btn"
          onClick={sendMessage}
        >
          {sending ? <Spinner /> : <IoMdSend />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}

export default connect(
  store => {
    return {
      user: store.auth.user,
    };
  },
  {}
)(GamePage);
