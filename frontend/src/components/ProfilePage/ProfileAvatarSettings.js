import React from "react";
import { Row, Col, Button, Spinner } from "reactstrap";
import defaultAvatar from "../../assets/defaultAvatar.png";
import { FaEdit } from "react-icons/fa";
import { mainStateHook } from "../../hooks";

const ProfileAvatarSettings = ({ avatar, updateProfile }) => {
  const [state, setState] = mainStateHook({
    avatar,
    avatarUrl: null,
    editing: false,
    loading: false,
  });

  const toggleEditState = () => {
    setState({ editing: !state.editing });
  };

  const changeAvatar = e => {
    setState({
      avatarFile: e.target.files[0],
      avatar: URL.createObjectURL(e.target.files[0]),
    });
  };

  const updateData = () => {
    if (state.avatar === avatar) return setState({ editing: false });

    setState({ loading: true });
    let avatarForm = new FormData();
    avatarForm.append("avatar", state.avatarFile);
    updateProfile(avatarForm, "file").then(
      res => {
        setState({
          loading: false,
          editing: false,
        });
      },
      err => {
        setState({
          loading: false,
        });
      }
    );
  };

  const closeEditForm = () => {
    setState({ editing: false, avatar, avatarFile: null });
  };

  return (
    <Row className="profileGameSettingsRow">
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
              background: 'url("' + state.avatar + '")',
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
