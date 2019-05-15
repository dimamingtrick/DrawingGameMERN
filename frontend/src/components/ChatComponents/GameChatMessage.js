import React from "react";
import moment from "moment";

const GameChatMessage = ({
  message: { type, user, message, createdAt },
  userLogin
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
        <div className="message-info">
          <div className="message-text">
            {user !== userLogin && type === "message" && (
              <div className="single-message-user">{user}</div>
            )}
            <div className="single-message-text">{message}</div>
          </div>
        </div>
        <div className="message-date">
          <div className="single-message-date">
            {moment(createdAt).format("HH:mm:ss DD/MM/YYYY")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameChatMessage;
