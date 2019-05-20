import React, { useState, useEffect, useRef } from "react";
import "./context-menu.css";

function ContextMenu({ children, onContextMenuOpen, onContextMenuClose }) {
  const [visible, setVisible] = useState(false);
  const root = useRef(null);

  const _handleContextMenu = event => {
    if (
      event.target.className.includes("message") &&
      !event.target.className !== "single-message" &&
      !event.target.className.includes("my-message")
    ) {
      event.preventDefault();
      setVisible(true);

      onContextMenuOpen(
        event.target.closest(".message-wrapper").getAttribute("data-id")
      );

      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = root.current.offsetWidth;
      const rootH = root.current.offsetHeight;

      const right = screenW - clickX > rootW;
      const left = !right;
      const top = screenH - clickY > rootH;
      const bottom = !top;

      if (right) {
        root.current.style.left = `${clickX + 5}px`;
      }

      if (left) {
        root.current.style.left = `${clickX - rootW - 5}px`;
      }

      if (top) {
        root.current.style.top = `${clickY + 5}px`;
      }

      if (bottom) {
        root.current.style.top = `${clickY - rootH - 5}px`;
      }
    }
  };

  const _handleClick = event => {
    const wasOutside = !(event.target.contains === root.current);

    if (wasOutside && visible) {
      onContextMenuClose();
      setVisible(false);
    }
  };

  const _handleScroll = () => {
    if (visible) {
      onContextMenuClose();
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("contextmenu", _handleContextMenu);
    document.addEventListener("click", _handleClick);
    document.addEventListener("scroll", _handleScroll);

    return () => {
      document.removeEventListener("contextmenu", _handleContextMenu);
      document.removeEventListener("click", _handleClick);
      document.removeEventListener("scroll", _handleScroll);
    };
  }, [visible]);

  return (
    (visible || null) && (
      <div ref={root} className="contextMenu">
        <div className="menu-options">{children}</div>
      </div>
    )
  );
}

export default ContextMenu;
