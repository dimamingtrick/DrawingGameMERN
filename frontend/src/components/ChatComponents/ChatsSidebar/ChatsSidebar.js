import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";

import { useConfirmModal } from "../../../hooks";
import { deleteChat, leaveChat } from "../../../actions/chat";
import { scrollInChatList } from "../../../helpers";
import ContextMenu from "../../ContextMenu/ContextMenu";
import { ConfirmModal } from "../../Modals";
import ChatSidebarListItem from "./ChatSidebarListItem/ChatSidebarListItem";
import "./chat-sidebar.css";

const showContextMenu = event => event.target.closest(".single-chat");

const ChatsSidebar = ({
  chats,
  history,
  location,
  user,
  addNewChat,
  deleteChat,
  leaveChat,
  selectedChat,
  setSelectedChat,
  inviteUserToChat,
  checkChatInfo,
}) => {
  const [confirmType, setConfirmType] = useState("");

  const confirmCallback = () => {
    history.push("/app/chats");
  };

  const deleteChatConfirmed = chatId => {
    return confirmType === "delete" ? deleteChat(chatId) : leaveChat(chatId);
  };

  const [
    setChatId,
    isOpen,
    isDeleting,
    deletingError,
    toggleDeleteModal,
    onConfirm,
  ] = useConfirmModal(deleteChatConfirmed, confirmCallback);

  useEffect(() => {
    const selectedChatId = location.pathname.replace("/app/chats/", "");
    if (selectedChatId && location.pathname !== "/app/chats")
      scrollInChatList(`chatSidebarItem-${selectedChatId}`);

    const slider = document.getElementById("sidebarBorder");
    slider.onmousedown = () => {
      document.onmousemove = e => {
        const sidebar = document.getElementById("sidebar");
        const sidebarWidth = (e.pageX / document.body.offsetWidth) * 100;
        document.body.style.cursor = "ew-resize";
        if (e.pageX >= 65 && sidebarWidth <= 75) {
          sidebar.style.width = sidebarWidth + "%";
          localStorage.setItem("chatSidebarWidth", sidebarWidth + "%");
        }
      };

      document.onmouseup = () => {
        document.body.style.cursor = "auto";
        document.onmousemove = document.onmouseup = null;
      };
    };
  }, []);

  const onContextMenuOpen = (event = null) => {
    if (event) {
      const selectedChatId = event.target
        .closest(".single-chat")
        .getAttribute("chat-id");

      setSelectedChat(chats.find(i => i._id === selectedChatId));
      setChatId(selectedChatId);
    }
  };

  const toggleConfirmModal = type => {
    setConfirmType(type);
    toggleDeleteModal();
  };

  const chatSidebarWidth = localStorage.getItem("chatSidebarWidth");
  return (
    <div
      id="sidebar"
      className="all-chats-list chat-sidebar"
      style={{
        width: chatSidebarWidth ? chatSidebarWidth : 65,
      }}
    >
      <div className="chat-sidebar-item">
        <Button
          onClick={addNewChat}
          color="secondary"
          className="add-new-chat-button"
        >
          + Add Group Chat
        </Button>
        <div className="chats-list-wrapper">
          {chats.map(chat => (
            <ChatSidebarListItem
              {...chat}
              key={chat._id}
              isActive={location.pathname.includes(chat._id)}
              user={user}
            />
          ))}
        </div>
      </div>
      <div
        id="sidebarBorder"
        className="chat-sidebar-border"
        onDragStart={() => false}
      />

      <ContextMenu
        key={chats}
        showContextMenu={showContextMenu}
        onContextMenuOpen={onContextMenuOpen}
      >
        {selectedChat && selectedChat.createdBy === user._id ? (
          <div
            className="menu-option"
            onClick={() => toggleConfirmModal("delete")}
          >
            Delete Chat
          </div>
        ) : (
          <div
            className="menu-option"
            onClick={() => toggleConfirmModal("leave")}
          >
            Leave Chat
          </div>
        )}
        <div className="menu-option" onClick={inviteUserToChat}>
          Invite to chat
        </div>
        <div className="menu-option" onClick={checkChatInfo}>
          Info
        </div>
      </ContextMenu>

      {/** Different modals if user want to delete/leave chat */}
      <ConfirmModal
        isOpen={isOpen}
        toggle={toggleDeleteModal}
        isDeleting={isDeleting}
        deletingError={deletingError}
        deleteConfirming={onConfirm}
        headerText={
          confirmType === "delete"
            ? "Delete this chat?"
            : "Do you realy want to leave this chat?"
        }
        bodyText={
          confirmType === "delete"
            ? "You will not be able to return it"
            : "You will not be able to return to it"
        }
        submitButtonText={confirmType === "delete" ? "Delete" : "Leave"}
      />
    </div>
  );
};

export default connect(
  store => ({
    user: store.auth.user,
  }),
  { deleteChat, leaveChat }
)(ChatsSidebar);
