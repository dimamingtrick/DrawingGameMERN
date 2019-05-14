import React from "react";
import {
  ProfileDataSection,
  ProfileGameSettingsSection
} from "../../components/ProfilePage";
import { Container } from "reactstrap";
import "./userProfile.css";

const UserProfile = () => {
  return (
    <Container fluid className="profileContainer">
      <ProfileDataSection />
      <hr />
      <ProfileGameSettingsSection />
    </Container>
  );
};

export default UserProfile;
