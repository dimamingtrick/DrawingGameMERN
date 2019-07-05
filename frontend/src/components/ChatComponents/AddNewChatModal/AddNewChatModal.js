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
import "./add-new-chat.scss";

const initialState = {
  inputValue: "",
  usersLoading: true,
  users: [],
  selectUsers: [],
  isSubmitting: false,
  submittingError: "",
  errors: [],
};

const AddNewChatModal = ({ user, isOpen, toggle, chatAddSuccess }) => {
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

  const changeInputValue = e => {
    setState({
      inputValue: e.target.value,
      ...(state.errors.find(i => i.field === "name")
        ? { errors: state.errors.filter(i => i.field !== "name") }
        : {}),
    });
  };

  const selectUsers = e => {
    const selectedUsers = Array.from(e.target.options)
      .filter(i => i.selected)
      .map(i => i.value);

    setState({
      selectedUsers,
      ...(state.errors.find(i => i.field === "users")
        ? { errors: state.errors.filter(i => i.field !== "users") }
        : {}),
    });
  };

  const addNewChat = () => {
    setState({ isSubmitting: true });
    ChatService.addNewChat({
      name: state.inputValue,
      users: state.selectedUsers,
    })
      .then(res => {
        chatAddSuccess(res);
        closeModal();
      })
      .catch(errors => {
        setState({ isSubmitting: false, errors });
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
      <ModalHeader>Add New Chat</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="chatName">Chat Name</Label>
            <Input
              type="text"
              name="chatName"
              id="chatName"
              placeholder="Enter chat name..."
              value={state.inputValue}
              onChange={changeInputValue}
            />
          </FormGroup>

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
            {state.errors.length > 0 && (
              <div className="add-chat-errors-wrapper">
                {state.errors.map(error => (
                  <div key={error.field} className="todo-error add-chat-error">
                    {error.message}
                  </div>
                ))}
              </div>
            )}
            <div className="form-button-wrapper">
              <Button
                outline
                className="confirm-button"
                color="info"
                onClick={addNewChat}
                disabled={state.errors.length > 0}
              >
                {state.isSubmitting ? (
                  <Spinner size="sm" color="#fff" />
                ) : (
                  "Add Chat"
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

export default AddNewChatModal;
