import React from "react";
// import chatbg from "../../assets/chatbg.png";

const ChatMessagesContainer = ({ children, background }) => {
  return (
    <div
      className="chat-messages"
      style={{
        background: 'url("' + background + '")',
        backgroundSize: "100%"
      }}
    >
      {children}
    </div>
  );
};

export default ChatMessagesContainer;
