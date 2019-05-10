import React from "react";
import {
  Button,
  InputGroup,
  Input,
  InputGroupAddon,
  Spinner
} from "reactstrap";
import { IoMdSend } from "react-icons/io";

function ChatInput({ inputMessage, handleInput, sendMessage, sending }) {
  return (
    <InputGroup>
      <Input
        value={inputMessage}
        onChange={handleInput}
        className="chat-input"
        placeholder="Message..."
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
}

export default ChatInput;
