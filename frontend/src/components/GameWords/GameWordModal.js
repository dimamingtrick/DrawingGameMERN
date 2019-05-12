import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

const GameWordModal = ({ isOpen, toggle, addNewWord }) => {
  const [word, setWord] = useState("");

  const handleWord = e => {
    setWord(e.target.value);
  };

  const submit = () => {
    addNewWord(word);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      // className={this.props.className}
      // unmountOnClose={this.state.unmountOnClose}
    >
      <ModalHeader toggle={toggle}>Add new word</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Add new word..."
          value={word}
          onChange={handleWord}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>
          Add new word
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GameWordModal;
