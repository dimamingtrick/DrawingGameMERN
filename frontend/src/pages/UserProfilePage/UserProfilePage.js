import React from "react";
import { connect } from "react-redux";
import { updateProfile } from "../../actions/auth";
import { updateGameSettings, getGameSettings } from "../../actions/game";
import {
  ProfileAvatarSettings,
  ProfileDataSection,
  ProfileGameSettingsSection,
} from "../../components/ProfilePage";
import { Container } from "reactstrap";
import "./user-profile-page.css";

const UserProfilePage = ({
  user,
  updateProfile,
  gameSettings,
  updateGameSettings,
  getGameSettings,
}) => {
  return (
    <Container fluid className="profileContainer">
      <ProfileAvatarSettings
        avatar={user.avatar}
        updateProfile={updateProfile}
      />
      <ProfileDataSection user={user} updateProfile={updateProfile} />
      <hr />
      <ProfileGameSettingsSection
        gameSettings={gameSettings}
        updateGameSettings={updateGameSettings}
        getGameSettings={getGameSettings}
      />
    </Container>
  );
};

export default connect(
  store => {
    return {
      user: store.auth.user,
      gameSettings: store.game.gameSettings,
    };
  },
  { updateProfile, updateGameSettings, getGameSettings }
)(UserProfilePage);
