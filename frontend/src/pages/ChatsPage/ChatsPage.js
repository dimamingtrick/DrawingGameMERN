import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { mainStateHook } from "../../hooks";
import { getAllChats } from "../../actions/chat";
import "./chats-page.css";
import {
  ChatMessagesContainer,
  SingleMessage,
  ChatInput
} from "../../components/GameChat";

const ChatsPage = ({ user, chats, getAllChats }) => {
  const [state, setState] = mainStateHook({
    load: chats.length === 0,
    currentChat: chats.length > 0 ? chats[0]._id : null,
    messages: []
  });

  const fetchData = () => {
    getAllChats().then(res => {
      setState({ load: false, currentChat: res[0]._id });
    });
  };

  useEffect(() => {
    if (chats.length === 0) fetchData();
  }, []);

  const selectNewChat = id => {
    setState({ currentChat: id });
  };

  if (state.load) return <h1>LOADING...</h1>;

  return (
    <Container fluid className="chats-container">
      <div className="all-chats-list">
        {chats.map(chat => (
          <div
            className={`single-chat ${
              state.currentChat === chat._id ? "active" : ""
            }`}
            key={chat._id}
            onClick={() => selectNewChat(chat._id)}
          >
            <div className="single-chat-user-data">
              {chat.users.find(u => u._id !== user._id).login}
            </div>
            <div className="single-chat-user-data">
              {chat.users.find(u => u._id !== user._id).email}
            </div>
          </div>
        ))}
      </div>
      <div className="single-chat-display">
        {/* {currentChat} */}
        <ChatMessagesContainer background={null}>
          {state.messages.map((msg, index) => (
            <SingleMessage
              key={msg._id ? msg._id : "otherType-" + index}
              message={msg}
              userLogin={user.login}
            />
          ))}
        </ChatMessagesContainer>
        <ChatInput
          inputMessage={"text"}
          handleInput={() => {}}
          sendMessage={() => {}}
          sending={false}
        />
      </div>
    </Container>
  );
};

export default connect(
  store => {
    return {
      user: store.auth.user,
      chats: store.chat.chats
    };
  },
  { getAllChats }
)(ChatsPage);
