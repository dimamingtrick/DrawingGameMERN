export const scrollToChatBottom = () => {
  const chatMessagesWrapper = document.querySelector(".chat-messages");
  chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
};
