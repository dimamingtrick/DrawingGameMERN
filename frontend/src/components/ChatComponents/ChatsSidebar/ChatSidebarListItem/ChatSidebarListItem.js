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
}) => {
  const userItem = users.find(u => u._id !== user._id);
  const showUnreadMessagesCount =
    unreadMessagesCount !== undefined && unreadMessagesCount !== 0;
  return (
    <Link
      to={`/app/chats/${_id}`}
      className={`single-chat ${isActive ? "active" : ""}`}
    >
      <CSSTransition
        in={showUnreadMessagesCount}
        timeout={200}
        classNames="unreadChatMessages"
        unmountOnExit
      >
        <div className="unread-messages-count">{unreadMessagesCount}</div>
      </CSSTransition>

      <div className="single-chat-partner-avatar" style={{
        background: `url('${userItem.avatar ? userItem.avatar : defaultAvatar}')`
      }} />
      <div className="single-chat-textfields">
        <div className="single-chat-user-data">{userItem.login}</div>
        <div className="single-chat-last-message">
          <span>
            {lastMessage &&
              (lastMessage.type === "text" ? lastMessage.message : "...")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ChatSidebarListItem;
