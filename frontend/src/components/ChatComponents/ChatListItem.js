import React from "react";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.png";

const ChatListItem = ({ _id, users, lastMessage, isActive, user }) => {
  return (
    <Link
      to={`/app/chats/${_id}`}
      className={`single-chat ${isActive ? "active" : ""}`}
    >
      <div className="single-chat-partner-avatar">
        <img src={defaultAvatar} alt="avatar" />
      </div>
      <div className="single-chat-textfields">
        <div className="single-chat-user-data">
          {users.find(u => u._id !== user._id).login}
        </div>
        <div className="single-chat-last-message">
          <span>{lastMessage && lastMessage.message}</span>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;
