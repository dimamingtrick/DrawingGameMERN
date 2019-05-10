import React from "react";
import moment from "moment";

function SingleMessage({ message, userLogin }) {
  return (
    <div
      className={`single-message ${
        message.user === userLogin
          ? "my-message"
          : message.user === null
          ? "chat-message"
          : ""
      } ${message.type === "join" ? "join-chat-message" : ""} ${
        message.type === "chatUserWinGame" ? "chatUserWinGameMessage" : ""
      }`}
    >
      <div className="message-wrapper">
        {message.user !== userLogin ||
          (message.type === "chatUserWinGame" && (
            <div className="single-message-user">{message.user}</div>
          ))}
        <div className="single-message-text">{message.message}</div>
        <div className="single-message-date">
          {moment(message.createdAt).format("HH:mm:ss DD/MM/YYYY")}
        </div>
      </div>
    </div>
  );
}

export default SingleMessage;
