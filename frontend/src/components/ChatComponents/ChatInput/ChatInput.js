import React from "react";
import {
  Button,
  InputGroup,
  Input,
  InputGroupText,
  InputGroupAddon,
  Spinner,
} from "reactstrap";
import { IoMdSend, IoMdImage } from "react-icons/io";
import "./chat-input.css";

const ChatInput = ({ inputMessage, handleInput, sendMessage, sending }) => {
  const openFileInput = () => {
    if (!sending) document.getElementById("chat-message-file").click();
  };

  const uploadFile = e => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", "image");
    sendMessage(formData);
  };

  return (
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
          if (e.keyCode === 13) sendMessage();
        }}
      />
      <InputGroupAddon addonType="append">
        <Button
          disabled={inputMessage === ""}
          className="input-submit-btn"
          onClick={() => sendMessage()}
        >
          {sending ? <Spinner /> : <IoMdSend />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ChatInput;
