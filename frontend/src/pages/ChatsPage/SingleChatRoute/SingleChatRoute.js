import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { scrollToChatBottom } from "../../../helpers";
import { mainStateHook } from "../../../hooks";
import { Spinner } from "reactstrap";
import {
  ChatMessagesContainer,
  ChatMessage,
  ChatInput,
} from "../../../components/ChatComponents";
import { ConfirmDeleteModal } from "../../../components/Modals";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import { ChatService } from "../../../services";
import { socket } from "../../DashboardContainer/DashboardContainer";
import { getGameSettings } from "../../../actions/game";
import "./single-chat-page.css";

let inputHandlingTimeoutFlag;
let selectedElementId = null;

function SingleChatRoute({
  user,
  match: {
    params: { id: chatId },
  },
  getGameSettings,
  gameSettings,
}) {
  const [state, setState] = mainStateHook({
    loading: true,
    chat: {},
    messages: [],
    inputValue: "",
    sending: false,
    confirmDeleteModalIsOpen: false,
    isDeleting: false,
    deletingError: "",
  });

  const [userIsTyping, setUserIsTyping] = useState(false);

  /** Fetching current chat messages and data if chatId changes */
  useEffect(() => {
    if (!gameSettings) getGameSettings();
    if (!state.loading) setState({ loading: true });
    ChatService.getSingleChatById(chatId).then(({ chat, messages }) => {
      setState({ loading: false, chat, messages });
      scrollToChatBottom();
    });
  }, [chatId]);

  /** Subscribing/unsubscribing to socket events */
  useEffect(() => {
    socket.on(`chat-${chatId}-newMessage`, newMessage => {
      setState({
        messages: [...state.messages, newMessage],
        ...(user._id === newMessage.userId
          ? { inputValue: "", sending: false }
          : {}),
      });
      if (userIsTyping) setUserIsTyping(false);
      scrollToChatBottom();
    });

    socket.on(`chat-${chatId}-messageDeleted`, ({ messageId, userId }) => {
      const isMyMessage = user._id === userId;
      setState({
        messages: state.messages.filter(i => i._id !== messageId),
        ...(isMyMessage
          ? { isDeleting: false, confirmDeleteModalIsOpen: false }
          : {}),
      });
      if (isMyMessage) selectedElementId = null;
    });

    socket.on(`chat${chatId}UserTypes`, () => {
      if (!userIsTyping) {
        setUserIsTyping(true);
        scrollToChatBottom();
      }
    });

    socket.on(`chat${chatId}UserStopTyping`, () => {
      if (userIsTyping) setUserIsTyping(false);
    });

    return () => {
      socket.off(`chat-${chatId}-newMessage`);
      socket.off(`chat-${chatId}-messageDeleted`);
      socket.off(`chat${chatId}UserTypes`);
      socket.off(`chat${chatId}UserStopTyping`);
    };
  });

  const handleInput = e => {
    clearInterval(inputHandlingTimeoutFlag);
    socket.emit("chatUserIsTyping", chatId);
    setState({ inputValue: e.target.value });
    inputHandlingTimeoutFlag = setTimeout(() => {
      socket.emit("chatUserStopTyping", chatId);
    }, 750);
  };

  /** Send message to chat */
  const sendMessage = (file = null) => {
    setState({ sending: true });

    let message = file
      ? file
      : {
          message: state.inputValue,
          type: "text",
        };

    ChatService.sendNewMessage(chatId, message, file ? "image" : "text").catch(
      err => {
        setState({
          sending: false,
        });
      }
    );
  };

  const onContextMenuOpen = id => {
    selectedElementId = id;
  };

  const toggleDeleteModal = () => {
    setState({
      confirmDeleteModalIsOpen: !state.confirmDeleteModalIsOpen,
      ...(state.confirmDeleteModalIsOpen && state.deletingError !== ""
        ? { deletingError: "" }
        : {}),
    });
  };

  const deleteMessageConfirmed = () => {
    setState({ isDeleting: true, deletingError: false });
    ChatService.deleteMessage(chatId, selectedElementId).catch(err => {
      console.log("ERR", err);
      setState({ isDeleting: false, deletingError: err.message });
    });
  };

  const {
    loading,
    messages,
    chat,
    sending,
    inputValue,
    confirmDeleteModalIsOpen,
    isDeleting,
    deletingError,
  } = state;
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

      <ConfirmDeleteModal
        isOpen={confirmDeleteModalIsOpen}
        toggle={toggleDeleteModal}
        isDeleting={isDeleting}
        deletingError={deletingError}
        deleteConfirming={deleteMessageConfirmed}
        headerText="Delete this message?"
        bodyText="You will not be able to return it"
      />

      <ContextMenu onContextMenuOpen={onContextMenuOpen}>
        <div className="menu-option" onClick={toggleDeleteModal}>
          Delete
        </div>
        <div className="menu-option">Close</div>
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
