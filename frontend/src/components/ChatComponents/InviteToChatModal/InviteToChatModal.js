import React, { useEffect } from "react";
import {
  Spinner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import { UserService, ChatService } from "../../../services";
import { mainStateHook } from "../../../hooks";

const initialState = {
  usersLoading: true,
  users: [],
  selectedUsers: [],
  isSubmitting: false,
  error: "",
};

const InviteToChatModal = ({ chat, user, isOpen, toggle, inviteSuccess }) => {
  const [state, setState] = mainStateHook(initialState);

  useEffect(() => {
    if (isOpen) {
      UserService.getAllUsers()
        .then(res => {
          setState({
            users: res.users.filter(i => i._id !== user._id),
            usersLoading: false,
          });
        })
        .catch(err => toggle());
    }
  }, [isOpen]);

  const closeModal = () => {
    setState(initialState);
    toggle();
  };

  const selectUsers = e => {
    const selectedUsers = Array.from(e.target.options)
      .filter(i => i.selected)
      .map(i => i.value);

    setState({
      selectedUsers,
      error: "",
    });
  };

  const inviteToChat = () => {
    setState({ isSubmitting: true });
    ChatService.inviteToChat(chat._id, {
      users: state.selectedUsers,
    })
      .then(res => {
        inviteSuccess(res);
        closeModal();
      })
      .catch(error => {
        setState({ isSubmitting: false, error: error.message });
      });
  };

  return (
    <Modal
      className="add-new-chat-modal"
      isOpen={isOpen}
      toggle={toggle}
      backdrop={state.isSubmitting ? "static" : true}
      modalTransition={{ timeout: 25 }}
      backdropTransition={{ timeout: 25 }}
    >
      <ModalHeader>Invite users to chat</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup className="user-select">
            <Label for="users">Select users</Label>
            {state.usersLoading ? (
              <Spinner className="user-select-spinner" size="sm" color="#fff" />
            ) : (
              <Input
                onChange={selectUsers}
                type="select"
                name="users"
                id="users"
                multiple
              >
                {state.users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.login}
                  </option>
                ))}
              </Input>
            )}
          </FormGroup>

          <FormGroup className="add-chat-modal-footer">
            {state.error && (
              <div className="add-chat-errors-wrapper">
                <div className="todo-error add-chat-error">{state.error}</div>
              </div>
            )}
            <div className="form-button-wrapper">
              <Button
                outline
                className="confirm-button"
                color="info"
                onClick={inviteToChat}
                disabled={state.error !== ""}
              >
                {state.isSubmitting ? (
                  <Spinner size="sm" color="#fff" />
                ) : (
                  "Invite"
                )}
              </Button>
              <Button
                type="button"
                outline
                className="cancel-button"
                color="danger"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default InviteToChatModal;
