import React from "react";
import { Row, Col, Button, Spinner } from "reactstrap";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { FaEdit } from "react-icons/fa";
import { mainStateHook, useProfileState } from "../../hooks";

const ProfileAvatarSettings = () => {
  // const [state, handleField, toggleEditState, updateData] = useProfileState();

  const [state, setState] = mainStateHook({
    avatar: null,
    avatarUrl: null,
    editing: false,
    loading: false,
  });

  const toggleEditState = () => {
    setState({ editing: !state.editing });
  };

  const changeAvatar = e => {
    setState({
      avatar: e.target.files[0],
      avatarUrl: URL.createObjectURL(e.target.files[0]),
    });
  };

  const updateData = () => {
    console.log(state.avatar);
  };

  const closeEditForm = () => {
    setState({ editing: false, avatar: null, avatarUrl: null });
  };

  return (
    <Row>
      <Col xs={12} className="profileContent">
        <div className="profile-fields-container">
          {!state.editing ? (
            <div className="edit-icon">
              <FaEdit onClick={toggleEditState} />
            </div>
          ) : (
            <div className="button-container">
              <Button
                outline
                color="primary"
                disabled={state.loading}
                onClick={updateData}
              >
                {state.loading ? <Spinner /> : "Save"}
              </Button>
              <Button
                outline
                color="danger"
                disabled={state.loading}
                onClick={closeEditForm}
              >
                Close
              </Button>
            </div>
          )}
          <div
            className="userAvatar"
            style={{
              background: 'url("' + state.avatarUrl + '")',
            }}
          />
          {state.editing && (
            <input type="file" name="avatar" onChange={changeAvatar} />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ProfileAvatarSettings;
