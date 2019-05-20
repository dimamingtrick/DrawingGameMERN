import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { scrollToChatBottom } from "../../../helpers";
import { mainStateHook } from "../../../hooks";
import { Spinner } from "reactstrap";
import {
  ChatMessagesContainer,
  ChatMessage,
  ChatInput
} from "../../../components/ChatComponents";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import { ChatService } from "../../../services";
import { socket } from "../../DashboardContainer/DashboardContainer";
import { getGameSettings } from "../../../actions/game";
import "./single-chat-page.css";

let inputHandlingTimeoutFlag;

function SingleChatRoute({
  user,
  match: {
    params: { id: chatId }
  },
  getGameSettings,
  gameSettings
}) {
  const [state, setState] = mainStateHook({
    loading: true,
    chat: {},
    messages: [],
    inputValue: "",
    sending: false
  });

  const [userIsTyping, setUserIsTyping] = useState(false);

  /** Fetching current chat messages if chatId changes */
  useEffect(() => {
    if (!gameSettings) getGameSettings();
    if (!state.loading) setState({ loading: true });
    ChatService.getSingleChatById(chatId).then(({ chat, messages }) => {
      setState({ loading: false, chat, messages });
    });
  }, [chatId]);

  /** Subscribing to socket events */
  useEffect(() => {
    socket.on(`chat-${chatId}-newMessage`, newMessage => {
      setState({
        messages: [...state.messages, newMessage],
        ...(user._id === newMessage.userId
          ? { inputValue: "", sending: false }
          : {})
      });
      if (userIsTyping) setUserIsTyping(false);
    });

    socket.on(`chat${chatId}UserTypes`, () => {
      if (!userIsTyping) setUserIsTyping(true);
    });

    socket.on(`chat${chatId}UserStopTyping`, () => {
      if (userIsTyping) setUserIsTyping(false);
    });

    return () => {
      socket.off(`chat-${chatId}-newMessage`);
      socket.off(`chat${chatId}UserTypes`);
      socket.off(`chat${chatId}UserStopTyping`);
    };
  });

  /** Scroll to bottom of chat if messages length changes */
  useEffect(() => {
    scrollToChatBottom();
  }, [state.messages, userIsTyping]);

  const handleInput = e => {
    clearInterval(inputHandlingTimeoutFlag);
    socket.emit("chatUserIsTyping", chatId);
    setState({ inputValue: e.target.value });
    inputHandlingTimeoutFlag = setTimeout(() => {
      socket.emit("chatUserStopTyping", chatId);
    }, 750);
  };

  /** Send message to chat */
  const sendMessage = () => {
    setState({ sending: true });
    ChatService.sendNewMessage(chatId, state.inputValue).catch(err => {
      setState({
        sending: false
      });
    });
  };

  const { loading, messages, chat, sending, inputValue } = state;
  return (
    <>
      <ChatMessagesContainer
        background={gameSettings ? gameSettings.background : null}
        userThatTypes={chat.users && chat.users.find(u => u._id !== user._id)}
        userIsTyping={userIsTyping}
      >
        {loading ? (
          <Spinner />
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={msg._id ? msg._id : "otherType-" + index}
              message={msg}
              type={msg.type}
              userFrom={chat.users.find(u => u._id === msg.userId)}
              user={user}
            />
          ))
        )}
        {messages.length === 0 && !loading && (
          <div className="no-messages-found">No messages found...</div>
        )}
      </ChatMessagesContainer>
      <ChatInput
        inputMessage={inputValue}
        handleInput={handleInput}
        sendMessage={sendMessage}
        sending={sending}
      />

      <ContextMenu>
        <div className="menu-option">hello</div>
        <div className="menu-option">context</div>
        <div className="menu-option">menu</div>
        <div className="menu-option">is</div>
        <div className="menu-option">working</div>
      </ContextMenu>
    </>
  );
}

export default connect(
  store => {
    return { gameSettings: store.game.gameSettings };
  },
  { getGameSettings }
)(SingleChatRoute);
