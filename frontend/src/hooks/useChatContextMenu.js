import { useState, useEffect } from "react";

const useChatContextMenu = () => {
  const [contextMenuIsVisible, setContextMenuIsVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    left: 0,
    top: 0
  });

  const showContextMenu = e => {
    if (
      e.target.className.includes("message") &&
      !e.target.className.includes("single-message") &&
      !e.target.className.includes("my-message")
    ) {
      e.preventDefault();

      setContextMenuIsVisible(!contextMenuIsVisible);
      console.log(e);
      setContextMenuPosition({
        left: e.pageX,
        top: e.pageY
      });
    }
  };

  useEffect(() => {
    const msg = document.getElementById("chatMessages");
    msg.addEventListener("contextmenu", showContextMenu);
    return () => {
      msg.removeEventListener("contextmenu", showContextMenu);
    };
  });

  return [contextMenuIsVisible, contextMenuPosition];
};

export default useChatContextMenu;
