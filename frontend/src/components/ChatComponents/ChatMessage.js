import React from "react";
import moment from "moment";
import defaultAvatar from "../../assets/defaultAvatar.png";

const ChatMessage = ({ message, userFrom, user }) => {
  return (
    <div
      className={`single-message${
        message.userId === user._id ? " my-message" : ""
      }`}
    >
      <div className="message-wrapper" data-id={message._id}>
        <div className="message-info">
          <div className="message-text">
            <div className="single-message-text">
              {message.type === "image" ? (
                <img className="chat-message-image" src={message.message} />
              ) : (
                message.message
              )}
            </div>
          </div>
          <div className="message-user-avatar">
            <img src={defaultAvatar} alt="avatar" />
          </div>
        </div>
        <div className="message-date">
          <div className="single-message-date">
            {moment(message.createdAt).format("HH:mm:ss DD/MM/YYYY")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
