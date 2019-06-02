import React, { useEffect, useRef } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Spinner } from "reactstrap";
import SingleChatRoute from "./SingleChatRoute/SingleChatRoute";
import { ChatsSidebar, ChatIsNotSelected } from "../../components/ChatComponents";
import { mainStateHook } from "../../hooks";
import { getAllChats, updateChat } from "../../actions/chat";
import { socket } from "../DashboardContainer/DashboardContainer";
import "./chats-page.css";

let isStillLoading;

const ChatsPage = ({ chats, getAllChats, history, location, updateChat }) => {
  const [state, setState] = mainStateHook({
    load: chats.length === 0,
    longLoading: false,
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
        /** User recieve new message and chat 'last message' is changed */
        socket.on(`chat-${chat._id}-getUpdate`, updatedChat => {
          updateChat(updatedChat);
        });
      });
    }

    return () => {
      if (chats.length > 0) {
        chats.forEach(chat => {
          socket.off(`chat-${chat._id}-getUpdate`);
        });
      }
    };
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
          <ChatsSidebar chats={chats} location={location} />
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
    };
  },
  { getAllChats, updateChat }
)(ChatsPage);
