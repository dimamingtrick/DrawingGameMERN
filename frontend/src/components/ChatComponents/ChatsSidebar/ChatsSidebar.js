import React from "react";
import { connect } from "react-redux";
import ChatSidebarListItem from "./ChatSidebarListItem/ChatSidebarListItem";
import "./chat-sidebar.css";

const ChatsSidebar = ({ chats, location, user }) => (
  <div className="all-chats-list chat-sidebar">
    {chats.map(chat => (
      <ChatSidebarListItem
        {...chat}
        key={chat._id}
        isActive={location.pathname.includes(chat._id)}
        user={user}
      />
    ))}
  </div>
);

export default connect(store => ({
  user: store.auth.user,
}))(ChatsSidebar);
