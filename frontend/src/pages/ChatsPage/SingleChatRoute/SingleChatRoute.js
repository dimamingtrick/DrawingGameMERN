import React, { useEffect } from "react";
import { connect } from "react-redux";
import { mainStateHook } from "../../../hooks";
import { Spinner } from "reactstrap";
import {
  ChatMessagesContainer,
  ChatMessage,
  ChatInput
} from "../../../components/ChatComponents";
import { ChatService } from "../../../services";
import { socket } from "../../DashboardContainer/DashboardContainer";
import "./single-chat-page.css";

const SingleChatRoute = ({
  user,
  match: {
    params: { id: chatId }
  }
}) => {
  const [state, setState] = mainStateHook({
    loading: false,
    chat: {},
    messages: [],
    inputValue: "",
    sending: false
  });

  const scrollToChatBottom = () => {
    const chatMessagesWrapper = document.querySelector(".chat-messages");
    chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
  };

  /** Fetching current chat messages if chatId changes */
  useEffect(() => {
    const fetchChatData = () => {
      setState({ loading: true });
      ChatService.getSingleChatById(chatId).then(({ chat, messages }) => {
        setState({ loading: false, chat, messages });
      });
    };
    fetchChatData();
  }, [chatId]);

  /**
   * subscribing to socket events;
   */
  useEffect(() => {
    socket.on(`chat-${chatId}-newMessage`, ({ newMessage }) => {
      setState({
        messages: [...state.messages, newMessage],
        ...(user._id === newMessage.userId
          ? { inputValue: "", sending: false }
          : {})
      });
    });
    return () => {
      socket.off(`chat-${chatId}-newMessage`);
    };
  });

  /** Scroll to bottom of chat if messages length changes */
  useEffect(() => {
    scrollToChatBottom();
  }, [state.messages]);

  const handleInput = e => {
    setState({ inputValue: e.target.value });
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
        background={
          "https://i.pinimg.com/originals/d3/a6/6f/d3a66fad20842b1571ac9b7e65a8cb96.jpg"
        }
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
        {messages.length === 0 && !loading && "No messages"}
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
    return {};
  },
  {}
)(SingleChatRoute);
