import React from "react";
import { connect } from "react-redux";
import { mainStateHook } from "../../hooks";
import { updateProfile } from "../../actions/auth";
import { Container, Row, Col, Input, Button, Spinner } from "reactstrap";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import "./userProfile.css";

const UserProfile = ({ user, updateProfile }) => {
  const [state, setState] = mainStateHook({
    editing: false,
    loading: false,
    data: {
      email: user.email,
      login: user.login,
    },
    errors: {},
  });

  const toggleEditState = () => {
    setState({ editing: !state.editing });
  };

  const changeField = e => {
    setState({
      data: {
        ...state.data,
        [e.target.name]: e.target.value,
      },
      errors: {
        ...state.errors,
        ...(state.errors[e.target.name] ? { [e.target.name]: "" } : {}),
      },
    });
  };

  const updateProfileData = () => {
    setState({ loading: true });
    updateProfile({ data: state.data, errors: {} }).then(
      () => {
        setState({ editing: false, loading: false });
      },
      errors => {
        console.log("Update profile err", errors);
        setState({ loading: false, errors });
      }
    );
  };

  return (
    <Container fluid className="profileContainer">
      <Row>
        <Col xs={12} className="profileContent">
          <div
            className="userAvatar"
            style={{
              background: 'url("' + defaultAvatar + '")',
            }}
          />

          <div className="profile-fields-container">
            {!state.editing && <FaEdit onClick={toggleEditState} />}
            <div className="profile-field">
              <span>Email: </span>
              {state.editing ? (
                <div>
                  <Input
                    name="email"
                    onChange={changeField}
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
                    onChange={changeField}
                    defaultValue={user.login}
                  />
                  <div className="todo-error">{state.errors.login}</div>
                </div>
              ) : (
                user.login
              )}
            </div>
            {state.editing && (
              <Button disabled={state.loading} onClick={updateProfileData}>
                {state.loading ? <Spinner /> : "Save"}
              </Button>
            )}
            <div className="profile-field">
              <span>Register at:</span>{" "}
              {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default connect(
  store => {
    return {
      user: store.auth.user,
    };
  },
  { updateProfile }
)(UserProfile);
