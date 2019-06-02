import React from "react";
import {
  Button,
  InputGroup,
  Input,
  InputGroupText,
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { CSSTransition } from "react-transition-group";
import { IoMdSend, IoMdImage } from "react-icons/io";
import "./chat-input.css";

const ChatInput = ({
  inputMessage,
  handleInput,
  sendMessage,
  sending,
  editedMessage,
  closeEditing,
}) => {
  const openFileInput = () => {
    if (!sending) document.getElementById("chat-message-file").click();
  };

  const submitSendingMessage = () => {
    if (!sending) sendMessage();
  };

  const uploadFile = e => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", "image");
    sendMessage(formData);
  };

  return (
    <div className="chat-input-container">
      {/* {editedMessage && ( */}
      <CSSTransition
        in={editedMessage !== null}
        timeout={100}
        classNames="editChatMessageState"
        unmountOnExit
      >
        <EditingChatMessage
          closeEditing={closeEditing}
          editedMessage={editedMessage}
        />
      </CSSTransition>
      {/* )} */}
      <InputGroup className="chat-input-group">
        <InputGroupAddon addonType="prepend">
          <InputGroupText onClick={openFileInput}>
            <IoMdImage />
          </InputGroupText>
          <Input
            onChange={uploadFile}
            name="chatMessageImage"
            type="file"
            id="chat-message-file"
          />
        </InputGroupAddon>
        <Input
          value={inputMessage}
          onChange={handleInput}
          className="chat-input"
          placeholder="Message..."
          autoFocus
          onKeyDown={e => {
            if (e.keyCode === 13) submitSendingMessage();
          }}
        />
        <InputGroupAddon addonType="append">
          <Button
            disabled={inputMessage === ""}
            className="input-submit-btn"
            onClick={submitSendingMessage}
          >
            {sending ? <Spinner /> : <IoMdSend />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

const EditingChatMessage = ({ editedMessage = null, closeEditing }) => (
  <div className="editing-message-container">
    <div className="message-text">
      {editedMessage ? editedMessage.message : ""}
    </div>
    <Button onClick={closeEditing} close />
  </div>
);

export default ChatInput;
