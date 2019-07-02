import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { FaAngleRight } from "react-icons/fa";

import ChatSidebarListItem from "./ChatSidebarListItem/ChatSidebarListItem";
import "./chat-sidebar.css";

const ChatsSidebar = ({ chats, location, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatSidebarState = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`all-chats-list chat-sidebar ${
        isOpen ? "chat-sidebar-isOpen" : ""
      }`}
    >
      <Button
        className="toggle-chat-sidebar-btn"
        onClick={toggleChatSidebarState}
        color="secondary"
      >
        <FaAngleRight />
      </Button>

      <div className="chats-list-wrapper">
        {chats.map(chat => (
          <ChatSidebarListItem
            {...chat}
            key={chat._id}
            isActive={location.pathname.includes(chat._id)}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default connect(store => ({
  user: store.auth.user,
}))(ChatsSidebar);
