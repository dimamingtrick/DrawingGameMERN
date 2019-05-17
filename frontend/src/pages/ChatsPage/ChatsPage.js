import React, { useEffect, useRef } from "react";
import { Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Spinner } from "reactstrap";
import SingleChatRoute from "./SingleChatRoute/SingleChatRoute";
import { mainStateHook } from "../../hooks";
import { getAllChats } from "../../actions/chat";
import "./chats-page.css";

let isStillLoading;

const ChatsPage = ({ user, chats, getAllChats, history, location }) => {
  const [state, setState] = mainStateHook({
    load: chats.length === 0,
    longLoading: false
  });

  const loadState = useRef(state.load);

  /** fetching chats or redirect to first chat page if there is already chats */
  useEffect(() => {
    const fetchData = () => {
      getAllChats().then(res => {
        clearTimeout(isStillLoading);
        setState({
          load: false,
          ...(state.longLoading ? { longLoading: false } : {})
        });
      });
    };

    if (chats.length === 0) fetchData();
    else history.push(`/app/chats/${chats[0]._id}`);
  }, []);

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
          <div className="all-chats-list">
            {chats.map(chat => (
              <Link
                key={chat._id}
                to={`/app/chats/${chat._id}`}
                className={`single-chat ${
                  location.pathname.includes(chat._id) ? "active" : ""
                }`}
              >
                <div className="single-chat-user-data">
                  {chat.users.find(u => u._id !== user._id).login}
                </div>
                <div className="single-chat-user-data">
                  {chat.users.find(u => u._id !== user._id).email}
                </div>
              </Link>
            ))}
          </div>
          <div className="single-chat-display">
            <Route
              path="/app/chats"
              exact
              render={() => (
                <div
                  style={{
                    background: `url('https://wallpaperplay.com/walls/full/4/7/4/17343.jpg')`
                  }}
                  className="select-chat-wrapper"
                >
                  Select chat to start messaging
                </div>
              )}
            />
            <Route
              path="/app/chats/:id"
              render={navProps => <SingleChatRoute user={user} {...navProps} />}
            />
          </div>
        </>
      )}
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
