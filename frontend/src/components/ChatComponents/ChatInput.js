import React from "react";
import {
  Button,
  InputGroup,
  Input,
  InputGroupText,
  InputGroupAddon,
  Spinner
} from "reactstrap";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ inputMessage, handleInput, sendMessage, sending }) => {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>To the Left!</InputGroupText>
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
          onClick={sendMessage}
        >
          {sending ? <Spinner /> : <IoMdSend />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ChatInput;
