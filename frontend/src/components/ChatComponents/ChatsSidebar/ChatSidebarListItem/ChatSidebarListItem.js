import React from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import "./chat-sidebar-list-item.css";
import defaultAvatar from "../../../../assets/defaultAvatar.png";

const ChatSidebarListItem = ({
  _id,
  users,
  lastMessage,
  isActive,
  user,
  unreadMessagesCount,
  name,
}) => {
  const userItem = users.find(u => u._id !== user._id);
  const showUnreadMessagesCount =
    unreadMessagesCount !== undefined && unreadMessagesCount !== 0;
  return (
    <Link
      id={`chatSidebarItem-${_id}`}
      to={`/app/chats/${_id}`}
      className={`single-chat ${isActive ? "active" : ""}`}
      chat-id={_id}
    >
      <CSSTransition
        in={showUnreadMessagesCount}
        timeout={200}
        classNames="unreadChatMessages"
        unmountOnExit
      >
        <div className="unread-messages-count">{unreadMessagesCount}</div>
      </CSSTransition>

      {!name && (
        <CSSTransition
          in={userItem.isOnline}
          timeout={200}
          classNames="unreadChatMessages"
          unmountOnExit
        >
          <div className="user-online-circle" />
        </CSSTransition>
      )}

      {name ? (
        <div
          className="single-chat-partner-avatar"
          style={{
            background: `rgba(0, 0, 0, .35)`,
          }}
        >
          {`${name[0]}${name[1] ? name[1] : ""}`.toUpperCase()}
        </div>
      ) : (
        <div
          className="single-chat-partner-avatar"
          style={{
            background: `url('${
              userItem.avatar ? userItem.avatar : defaultAvatar
            }')`,
          }}
        />
      )}

      <div className="single-chat-textfields">
        <div className="single-chat-user-data">
          {name ? name : userItem.login}
        </div>
        <div className="single-chat-last-message">
          <span>
            {lastMessage && lastMessage.type === "text"
              ? lastMessage.message
              : "..."}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ChatSidebarListItem;
