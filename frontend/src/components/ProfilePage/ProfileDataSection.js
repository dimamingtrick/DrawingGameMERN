import React from "react";
import { Input, Button, Spinner, Row, Col } from "reactstrap";
import { useProfileState } from "../../hooks";
import { FaEdit } from "react-icons/fa";
import moment from "moment";

const ProfileDataSection = ({ user, updateProfile }) => {
  const [state, handleField, toggleEditState, updateData] = useProfileState(
    updateProfile
  );

  return (
    <Row>
      <Col xs={12} className="profileContent">
        <div className="profile-fields-container">
          {!state.editing ? (
            <div className="edit-icon">
              <FaEdit onClick={toggleEditState} />
            </div>
          ) : (
            <Button
              outline
              color="primary"
              disabled={state.loading}
              onClick={updateData}
            >
              {state.loading ? <Spinner /> : "Save"}
            </Button>
          )}

          <div className="profile-field">
            <span>Email: </span>
            {state.editing ? (
              <div>
                <Input
                  name="email"
                  onChange={handleField}
                  defaultValue={user.email}
                />
                <div className="todo-error">{state.errors.email}</div>
              </div>
            ) : (
              user.email
            )}
          </div>

          <div className="profile-field">
            <span>Login: </span>
            {state.editing ? (
              <div>
                <Input
                  name="login"
                  onChange={handleField}
                  defaultValue={user.login}
                />
                <div className="todo-error">{state.errors.login}</div>
              </div>
            ) : (
              user.login
            )}
          </div>

          <div className="profile-field">
            <span>Register at:</span>{" "}
            {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileDataSection;
