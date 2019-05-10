import React from "react";
import moment from "moment";

const SingleMessage = ({
  message: { type, user, message, createdAt },
  userLogin,
}) => {
  return (
    <div
      className={`single-message ${
        user === userLogin ? "my-message" : user === null ? "chat-message" : ""
      } ${type === "join" ? "join-chat-message" : ""} ${
        type === "chatUserWinGame" ? "chatUserWinGameMessage" : ""
      }`}
    >
      <div className="message-wrapper">
        {user !== userLogin ||
          (type !== "chatUserWinGame" && (
            <div className="single-message-user">{user}</div>
          ))}
        <div className="single-message-text">{message}</div>
        <div className="single-message-date">
          {moment(createdAt).format("HH:mm:ss DD/MM/YYYY")}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
