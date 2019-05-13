import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner
} from "reactstrap";
import "./gameWordModal.css";

const GameWordModal = ({ isOpen, toggle, addNewWord, error, loading }) => {
  const [word, setWord] = useState("");

  useEffect(() => {
    setWord("");
  }, [isOpen]);

  const handleWord = e => {
    setWord(e.target.value);
  };

  const submit = () => {
    addNewWord(word);
  };

  return (
    <Modal className="gameWordModal" isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add new word</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Add new word..."
          value={word}
          onChange={handleWord}
        />
        {error !== "" && <div className="todo-error">{error}</div>}
      </ModalBody>
      <ModalFooter>
        <Button
          className="addNewWordButton"
          disabled={loading}
          color="primary"
          onClick={submit}
        >
          {loading ? <Spinner /> : "Add new word"}
        </Button>
        <Button disabled={loading} color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GameWordModal;
