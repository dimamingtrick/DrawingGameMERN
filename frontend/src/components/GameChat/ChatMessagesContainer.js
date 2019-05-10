import React from "react";
import chatbg from "../../assets/chatbg.png";

const ChatMessagesContainer = ({ children }) => {
  return (
    <div
      className="chat-messages"
      style={{
        background: 'url("' + chatbg + '")',
      }}
    >
      {children}
    </div>
  );
};

export default ChatMessagesContainer;
