import React from "react";
import {connect} from 'react-redux';
import ChatListItem from "../ChatListItem";
import "./chat-sidebar.css";

const ChatsSidebar = ({ chats, location, user }) => (
  <div className="all-chats-list chat-sidebar">
    {chats.map(chat => (
      <ChatListItem
        {...chat}
        key={chat._id}
        isActive={location.pathname.includes(chat._id)}
        user={user}
      />
    ))}
  </div>
);

export default connect(
  store => ({
    user: store.auth.user
  })
)(ChatsSidebar);
