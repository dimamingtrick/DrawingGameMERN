import React from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import moment from "moment";

import defaultAvatar from "../../../assets/defaultAvatar.png";
import "./chat-info-modal.scss";

const ChatInfoModal = ({ chat, isOpen, toggle }) => {
  if (!chat) return null;

  return (
    <Modal
      className="chat-info-modal"
      isOpen={isOpen}
      toggle={toggle}
      backdrop={true}
      modalTransition={{ timeout: 25 }}
      backdropTransition={{ timeout: 25 }}
    >
      <ModalHeader>Chat Information</ModalHeader>
      <ModalBody>
        <div className="created-at">
          Created at:{" "}
          <span>{moment(chat.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        </div>

        <div className="users-in-chat">
          {chat.users.map(u => (
            <div className="single-user-in-chat" key={u._id}>
              <div
                className="avatar"
                style={{
                  background: `url('${u.avatar || defaultAvatar}')`,
                }}
              />
              <div className="login">{u.login}</div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          outline
          className="close-info-button"
          color="danger"
          onClick={toggle}
        >
          Close
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default ChatInfoModal;
