import React, { useEffect } from "react";
import { connect } from "react-redux";
import { scrollToChatBottom } from "../../../helpers";
import { mainStateHook } from "../../../hooks";
import { Spinner } from "reactstrap";
import {
  ChatMessagesContainer,
  ChatMessage,
  ChatInput
} from "../../../components/ChatComponents";
import { ChatService } from "../../../services";
import { socket } from "../../DashboardContainer/DashboardContainer";
import { getGameSettings } from "../../../actions/game";
import "./single-chat-page.css";

let inputHandlingTimeout;

const SingleChatRoute = ({
  user,
  match: {
    params: { id: chatId }
  },
  getGameSettings,
  gameSettings
}) => {
  const [state, setState] = mainStateHook({
    loading: true,
    chat: {},
    messages: [],
    inputValue: "",
    sending: false,
    userIsTyping: false
  });

  /** Fetching current chat messages if chatId changes */
  useEffect(() => {
    const fetchChatData = () => {
      if (!state.loading) setState({ loading: true });
      ChatService.getSingleChatById(chatId).then(({ chat, messages }) => {
        setState({ loading: false, chat, messages });
      });
    };
    fetchChatData();
  }, [chatId]);

  useEffect(() => {
    if (!gameSettings) getGameSettings();
  }, []);

  /** Subscribing to socket events */
  useEffect(() => {
    socket.on(`chat-${chatId}-newMessage`, ({ newMessage }) => {
      setState({
        messages: [...state.messages, newMessage],
        ...(user._id === newMessage.userId
          ? { inputValue: "", sending: false }
          : {}),
        ...(state.userIsTyping ? { userIsTyping: false } : {})
      });
    });

    socket.on(`chat${chatId}UserTypes`, () => {
      if (!state.userIsTyping) setState({ userIsTyping: true });
    });

    socket.on(`chat${chatId}UserStopTyping`, () => {
      if (state.userIsTyping) setState({ userIsTyping: false });
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
  }, [state.messages, state.userIsTyping]);

  const handleInput = e => {
    clearInterval(inputHandlingTimeout);
    socket.emit("chatUserIsTyping", chatId);
    setState({ inputValue: e.target.value });
    inputHandlingTimeout = setTimeout(() => {
      socket.emit("chatUserStopTyping", chatId);
    }, 750);
  };

  /** Send message to chat */
  const sendMessage = () => {
    setState({ sending: true });
    ChatService.sendNewMessage(chatId, { message: state.inputValue }).catch(
      err => {
        console.log(err);
        setState({
          sending: false
        });
      }
    );
  };

  const { loading, messages, chat, sending } = state;
  return (
    <>
      <ChatMessagesContainer
        background={gameSettings ? gameSettings.background : null}
        userThatTypes={chat.users && chat.users.find(u => u._id !== user._id)}
        userIsTyping={state.userIsTyping}
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
        inputMessage={state.inputValue}
        handleInput={handleInput}
        sendMessage={sendMessage}
        sending={sending}
      />
    </>
  );
};

export default connect(
  store => {
    return { gameSettings: store.game.gameSettings };
  },
  { getGameSettings }
)(SingleChatRoute);
