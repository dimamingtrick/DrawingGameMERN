import React, { useEffect, useRef } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Spinner } from "reactstrap";
import SingleChatRoute from "./SingleChatRoute/SingleChatRoute";
import {
  ChatsSidebar,
  ChatIsNotSelected,
  AddNewChatModal,
} from "../../components/ChatComponents";
import { mainStateHook } from "../../hooks";
import {
  getAllChats,
  updateChat,
  getUnreadMessagesCount,
  userChangeOnlineStatus,
  chatAddSuccess,
} from "../../actions/chat";
import { socket } from "../DashboardContainer/DashboardContainer";
import "./chats-page.css";
import { scrollInChatList } from "../../helpers";

let isStillLoading;

const ChatsPage = ({
  user,
  chats,
  getAllChats,
  history,
  location,
  updateChat,
  getUnreadMessagesCount,
  userChangeOnlineStatus,
  chatAddSuccess,
}) => {
  const [state, setState] = mainStateHook({
    load: chats.length === 0,
    longLoading: false,
    addChatModalIsOpen: false,
  });

  const loadState = useRef(state.load);

  /** Fetching chats or redirect to first chat page if there is already chats */
  useEffect(() => {
    const fetchData = () => {
      getAllChats().then(res => {
        clearTimeout(isStillLoading);
        setState({
          load: false,
          ...(state.longLoading ? { longLoading: false } : {}),
        });
      });
    };

    if (chats.length === 0) fetchData();
    else history.push(`/app/chats/${chats[0]._id}`);

    return () => clearInterval(isStillLoading);
  }, []);

  /** Subscribe to socket events */
  useEffect(() => {
    if (chats.length > 0) {
      chats.forEach(chat => {
        /** Get unread chat messages length */
        socket.on(
          `chat-${chat._id}-${user._id}-getUnreadMessagesCount`,
          getUnreadMessagesCount
        );
        /** User recieve new message and chat 'last message' is changed */
        socket.on(`chat-${chat._id}-${user._id}-getChatUpdate`, updateChat);
      });
      socket.on("userOnlineStatusChanged", userChangeOnlineStatus);

      return () => {
        chats.forEach(chat => {
          socket.off("userOnlineStatusChanged");
          socket.off(`chat-${chat._id}-${user._id}-getUnreadMessagesCount`);
          socket.off(`chat-${chat._id}-${user._id}-getChatUpdate`);
        });
      };
    }
  });

  /** Shows additional spinner if fetching all chats is more than 3 seconds */
  useEffect(() => {
    if (state.load && !state.longLoading) {
      loadState.current = state.load;
      isStillLoading = setTimeout(() => {
        if (loadState.current) setState({ longLoading: true });
      }, 2500);
      return () => {
        clearTimeout(isStillLoading);
      };
    }
  });

  const toggleAddChatModal = () => {
    setState({ addChatModalIsOpen: !state.addChatModalIsOpen });
  };

  const addNewChatCallback = newChat => {
    chatAddSuccess(newChat);
    history.push(`/app/chats/${newChat._id}`);
    scrollInChatList(`chatSidebarItem-${newChat._id}`);
  };

  return (
    <Container
      fluid
      className={`chats-container ${state.load && "chats-loading-container"}`}
    >
      {state.load ? (
        <div className={"chats-loading-spinners"}>
          <h1>Loading...</h1>
          {state.longLoading && <Spinner />}
        </div>
      ) : (
        <>
          <ChatsSidebar
            addNewChat={toggleAddChatModal}
            chats={chats}
            location={location}
          />
          <AddNewChatModal
            user={user}
            isOpen={state.addChatModalIsOpen}
            toggle={toggleAddChatModal}
            chatAddSuccess={addNewChatCallback}
          />
          <div className="single-chat-display">
            <Route path="/app/chats" exact component={ChatIsNotSelected} />
            <Route path="/app/chats/:id" component={SingleChatRoute} />
          </div>
        </>
      )}
    </Container>
  );
};

export default connect(
  store => {
    return {
      chats: store.chat.chats,
      user: store.auth.user,
    };
  },
  {
    getAllChats,
    updateChat,
    getUnreadMessagesCount,
    userChangeOnlineStatus,
    chatAddSuccess,
  }
)(ChatsPage);
