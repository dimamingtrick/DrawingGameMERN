import React from "react";
import {
  Spinner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

export default function ConfirmTodoDeleteModal({
  confirmModalIsOpen,
  toggleConfirmModal,
  deleteConfirm,
  isDeleting,
}) {
  return (
    <Modal
      isOpen={confirmModalIsOpen}
      toggle={toggleConfirmModal}
      backdrop={isDeleting ? "static" : true}
      modalTransition={{ timeout: 25 }}
      backdropTransition={{ timeout: 25 }}
    >
      <ModalHeader>Delete this todo item ?</ModalHeader>
      <ModalBody>You will not be able to return it</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={deleteConfirm}>
          {isDeleting ? <Spinner size="sm" color="#fff" /> : "Yes"}
        </Button>
        <Button color="danger" onClick={toggleConfirmModal}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
}
