import React from "react";
import {
  Spinner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./confirm-delete-modal.css";

export default function ConfirmDeleteModal({
  isOpen,
  toggle,
  isDeleting,
  deletingError = "",
  deleteConfirming,
  headerText = "",
  bodyText = "",
}) {
  return (
    <Modal
      className="confirm-delete-modal"
      isOpen={isOpen}
      toggle={toggle}
      backdrop={isDeleting ? "static" : true}
      modalTransition={{ timeout: 25 }}
      backdropTransition={{ timeout: 25 }}
    >
      <ModalHeader>{headerText}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter>
        <div className="todo-error">{deletingError}</div>
        <Button
          className="confirm-button"
          color="primary"
          onClick={deleteConfirming}
        >
          {isDeleting ? <Spinner size="sm" color="#fff" /> : "Delete"}
        </Button>
        <Button className="cancel-button" color="danger" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
