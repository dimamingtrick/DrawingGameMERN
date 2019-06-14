import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { scrollToChatBottom } from "../../../helpers";
import { mainStateHook } from "../../../hooks";
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

let inputHandlingTimeoutFlag; // flag for 'user is typing' state
let selectedElementId = null; // set id of message by contextmenu click
const chatMessageTransitionTimeout = {
  appear: 200,
  enter: 200,
  exit: 500,
};

// Show context menu if user clicks his own message
const userMessageContext = event =>
  event.target.closest(".single-message.my-message") &&
  event.target.className.includes("message") &&
  !event.target.className !== "single-message" &&
  !event.target.className.includes("my-message");

// Show context menu if user clicks other users messages
// const otherUserMessageContext = event =>
//   event.target.closest(".single-message") &&
//   !event.target.closest(".my-message") &&
//   event.target.className.includes("message") &&
//   !event.target.className !== "single-message" &&
//   !event.target.className.includes("my-message");

function SingleChatRoute({
  user,
  match: {
    params: { id: chatId },
  },
  getGameSettings,
  gameSettings,
}) {
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [state, setState] = mainStateHook({
    loading: true,
    chat: {},
    messages: [],
    inputValue: "",
    sending: false,

    confirmDeleteModalIsOpen: false,
    isDeleting: false,
    deletingError: "",

    editedMessage: null,
  });

  const getNewMessageInState = newMessage => {
    setState({
      messages: [...state.messages, newMessage],
      ...(user._id === newMessage.userId
        ? { inputValue: "", sending: false }
        : {}),
    });
    if (userIsTyping) setUserIsTyping(false);
    scrollToChatBottom();
  };

  const editMessageInState = updatedMessage => {
    setState({
      messages: state.messages.map(i => {
        if (i._id === updatedMessage._id) return updatedMessage;
        return i;
      }),
      ...(user._id === updatedMessage.userId
        ? { inputValue: "", editedMessage: null, sending: false }
        : {}),
    });
  };

  const updateChatMessage = updatedMessage => {
    setState({
      messages: state.messages.map(i => {
        if (i._id === updatedMessage._id) return updatedMessage;
        return i;
      }),
    });
  };

  const deleteMessageInState = ({ messageId, userId }) => {
    const isMyMessage = user._id === userId;
    setState({
      messages: state.messages.filter(i => i._id !== messageId),
      ...(isMyMessage
        ? { isDeleting: false, confirmDeleteModalIsOpen: false }
        : {}),
    });
    if (isMyMessage) selectedElementId = null;
  };

  const userStartTyping = () => {
    if (!userIsTyping) {
      setUserIsTyping(true);
      scrollToChatBottom();
    }
  };

  const userStopTyping = () => {
    if (userIsTyping) setUserIsTyping(false);
  };

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
    socket.on(`chat-${chatId}-newMessage`, getNewMessageInState);
    socket.on(`chat-${chatId}-messageUpdated`, editMessageInState);
    socket.on(`chat-${chatId}-messageDeleted`, deleteMessageInState);
    socket.on(`chat${chatId}UserTypes`, userStartTyping);
    socket.on(`chat${chatId}UserStopTyping`, userStopTyping);
    socket.on(`chat-${chatId}-userReadMessage`, updateChatMessage);
    socket.on(`chat-${chatId}-userLikesMessage`, updateChatMessage);
    return () => {
      socket.off(`chat-${chatId}-newMessage`);
      socket.off(`chat-${chatId}-messageUpdated`);
      socket.off(`chat-${chatId}-messageDeleted`);
      socket.off(`chat${chatId}UserTypes`);
      socket.off(`chat${chatId}UserStopTyping`);
      socket.off(`chat-${chatId}-userReadMessage`);
      socket.off(`chat-${chatId}-userLikesMessage`);
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

  /** Send message to chat (input text, file, updating message) */
  const sendMessage = (file = null) => {
    const { inputValue, editedMessage } = state;
    if (editedMessage !== null && inputValue === editedMessage.message) {
      return closeEditMessageState();
    }

    setState({ sending: true });
    let message = file
      ? file
      : {
          message: inputValue,
          type: "text",
        };

    if (editedMessage) {
      ChatService.editMessage(chatId, message, editedMessage._id).catch(err => {
        setState({
          sending: false,
        });
      });
    } else {
      ChatService.sendNewMessage(
        chatId,
        message,
        file ? "image" : "text"
      ).catch(err => {
        setState({
          sending: false,
        });
      });
    }
  };

  const onContextMenuOpen = (event = null) => {
    if (event)
      selectedElementId = event.target
        .closest(".message-wrapper")
        .getAttribute("data-id");
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

  const likeMessage = (messageId, likeOrDislike) => {
    socket.emit(likeOrDislike, { userId: user._id, messageId, chatId });
  };

  const toggleEditMessageState = () => {
    const messageToEdit = state.messages.find(i => i._id === selectedElementId);
    setState({
      editedMessage: messageToEdit,
      inputValue: messageToEdit.message,
    });
  };

  const closeEditMessageState = () => {
    setState({
      editedMessage: null,
      inputValue: "",
    });
    selectedElementId = null;
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
    editedMessage,
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
          <TransitionGroup>
            {messages.map(msg => (
              <CSSTransition
                key={`${msg._id}-chatMessage`}
                classNames="chatMessageTransition"
                timeout={chatMessageTransitionTimeout}
              >
                <ChatMessage
                  message={msg}
                  userFrom={chat.users.find(u => u._id === msg.userId)}
                  user={user}
                  likeMessage={likeMessage}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
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
        editedMessage={editedMessage}
        closeEditing={closeEditMessageState}
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

      {/** Right click on users message */}
      <ContextMenu
        showContextMenu={userMessageContext}
        onContextMenuOpen={onContextMenuOpen}
      >
        <div className="menu-option" onClick={toggleDeleteModal}>
          Delete
        </div>
        <div className="menu-option" onClick={toggleEditMessageState}>
          Edit
        </div>
        <div className="menu-option">Close</div>
      </ContextMenu>

      {/** Right click on other users messages */}
      {/* <ContextMenu
        showContextMenu={otherUserMessageContext}
        onContextMenuOpen={onContextMenuOpen}
      >
        <div className="menu-option" onClick={likeMessage}>
          Like
        </div>
        <div className="menu-option">Close</div>
      </ContextMenu> */}
    </>
  );
}

export default connect(
  store => {
    return { user: store.auth.user, gameSettings: store.game.gameSettings };
  },
  { getGameSettings }
)(SingleChatRoute);
