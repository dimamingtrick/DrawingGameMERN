import React from "react";
import { connect } from "react-redux";
import { Input, Button, Spinner, Row, Col } from "reactstrap";
import { updateProfile } from "../../actions/auth";
import { useProfileState } from "../../hooks";
import { FaEdit } from "react-icons/fa";
import defaultAvatar from "../../assets/defaultAvatar.png";
import moment from "moment";

const ProfileDataSection = ({ user, updateProfile }) => {
  const [state, handleField, toggleEditState, updateData] = useProfileState(
    updateProfile
  );

  return (
    <Row>
      <Col xs={12} className="profileContent">
        <div
          className="userAvatar"
          style={{
            background: 'url("' + defaultAvatar + '")'
          }}
        />
        <div className="profile-fields-container">
          {!state.editing ? (
            <FaEdit onClick={toggleEditState} />
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

export default connect(
  store => {
    return {
      user: store.auth.user
    };
  },
  { updateProfile }
)(ProfileDataSection);
