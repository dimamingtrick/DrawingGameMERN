import React from "react";
// import chatbg from "../../assets/chatbg.png";

const ChatMessagesContainer = ({ children, background }) => {
  console.log(background);
  return (
    <div className="main-chat-messages-wrapper">
      <div className="chat-messages">{children}</div>
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
