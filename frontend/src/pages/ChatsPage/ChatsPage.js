import React, { useEffect } from "react";
import { Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import SingleChatRoute from "./SingleChatRoute/SingleChatRoute";
import { mainStateHook } from "../../hooks";
import { getAllChats } from "../../actions/chat";
import "./chats-page.css";

const ChatsPage = ({ user, chats, getAllChats, history, location }) => {
  const [state, setState] = mainStateHook({
    load: chats.length === 0,
    messages: []
  });

  const fetchData = () => {
    getAllChats().then(res => {
      /** get id of current chat to set active class in chat sidebar */
      setState({
        load: false
      });
    });
  };

  /** fetching chats or redirect to first chat page if there is already chats */
  useEffect(() => {
    if (chats.length === 0) fetchData();
    else history.push(`/app/chats/${chats[0]._id}`);
  }, []);

  if (state.load) return <h1>LOADING...</h1>;

  return (
    <Container fluid className="chats-container">
      <div className="all-chats-list">
        {chats.map(chat => (
          <Link
            to={`/app/chats/${chat._id}`}
            className={`single-chat ${
              location.pathname.includes(chat._id) ? "active" : ""
            }`}
            key={chat._id}
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
          path="/app/chats/:id"
          render={navProps => <SingleChatRoute user={user} {...navProps} />}
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
