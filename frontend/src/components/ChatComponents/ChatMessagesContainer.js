import React from "react";

const ChatMessagesContainer = ({
  children,
  background,
  userThatTypes,
  userIsTyping
}) => {
  return (
    <div className="main-chat-messages-wrapper">
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

const ThreeDotsAnimated = () => (
  <span className="threedots">
    <span />
    <span />
    <span />
  </span>
);

export default ChatMessagesContainer;
