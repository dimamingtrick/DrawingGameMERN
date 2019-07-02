import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    /**
     * code example
     * https://plnkr.co/edit/ZiOgIXOacDwAL7g65STH?p=preview
     */
    const slider = document.getElementById("sidebarBorder");
    slider.onmousedown = event => {
      document.onmousemove = e => {
        const sidebar = document.getElementById("sidebar");
        // const width = e.pageX - sidebar.offsetWidth;
        if (e.pageX >= 65) sidebar.style.width = e.pageX + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
    };
  }, []);

  return (
    <div
      id="sidebar"
      className={`all-chats-list chat-sidebar ${
        isOpen ? "chat-sidebar-isOpen" : ""
      }`}
      style={{
        width: 65,
      }}
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
      <div
        id="sidebarBorder"
        className="chat-sidebar-border"
        onDragStart={() => false}
      />
    </div>
  );
};

export default connect(store => ({
  user: store.auth.user,
}))(ChatsSidebar);
