import React from "react";
// import chatbg from "../../assets/chatbg.png";

const ChatMessagesContainer = ({ children, background }) => {
  return (
    <div
      className="chat-messages"
      style={{
        background: 'url("' + background + '")'
      }}
    >
      {children}
    </div>
  );
};

export default ChatMessagesContainer;
