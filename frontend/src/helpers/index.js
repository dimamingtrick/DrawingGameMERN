export const scrollToChatBottom = () => {
  const chatMessagesWrapper = document.querySelector(".chat-messages");
  chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
};

export const scrollInChatList = (elementToScroll = null) => {
  const chatsList = document.querySelector(".chats-list-wrapper");

  chatsList.scrollTop = elementToScroll
    ? document.getElementById(elementToScroll).offsetTop - 30
    : chatsList.scrollHeight;
};
