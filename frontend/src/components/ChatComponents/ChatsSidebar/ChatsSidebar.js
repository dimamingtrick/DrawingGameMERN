import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";

import ChatSidebarListItem from "./ChatSidebarListItem/ChatSidebarListItem";
import "./chat-sidebar.css";

const ChatsSidebar = ({ chats, location, user, addNewChat }) => {
  useEffect(() => {
    /**
     * code example
     * https://plnkr.co/edit/ZiOgIXOacDwAL7g65STH?p=preview
     */
    const slider = document.getElementById("sidebarBorder");
    slider.onmousedown = () => {
      document.onmousemove = e => {
        const sidebar = document.getElementById("sidebar");
        const sidebarWidth = (e.pageX / document.body.offsetWidth) * 100;
        document.body.style.cursor = "ew-resize";
        if (e.pageX >= 65 && sidebarWidth <= 75) {
          sidebar.style.width = sidebarWidth + "%";
          localStorage.setItem("chatSidebarWidth", sidebarWidth + "%");
        }
      };

      document.onmouseup = () => {
        document.body.style.cursor = "auto";
        document.onmousemove = document.onmouseup = null;
      };
    };
  }, []);

  const chatSidebarWidth = localStorage.getItem("chatSidebarWidth");
  return (
    <div
      id="sidebar"
      className="all-chats-list chat-sidebar"
      style={{
        width: chatSidebarWidth ? chatSidebarWidth : 65,
      }}
    >
      <div className="chat-sidebar-item">
        <Button
          onClick={addNewChat}
          color="secondary"
          className="add-new-chat-button"
        >
          + Add Group Chat
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
