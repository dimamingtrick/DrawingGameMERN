import React from "react";
import ThreeDotsAnimated from "../ThreeDotsAnimated/ThreeDotsAnimated";

const ChatMessagesContainer = ({
  children,
  background,
  userThatTypes,
  userIsTyping
}) => {
  return (
    <div id="chatMessages" className="main-chat-messages-wrapper">
      <div className="chat-messages">{children}</div>
      {userThatTypes && userIsTyping && (
        <span className="chat-user-is-typing">
          {userThatTypes.login} is typing <ThreeDotsAnimated />
        </span>
      )}
      <div
        className="chat-messages-background"
        style={{
          background: 'url("' + background + '")'
        }}
      />
    </div>
  );
};

export default ChatMessagesContainer;
