import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import defaultAvatar from "../../assets/defaultAvatar.png";
import moment from "moment";
import "./userProfile.css";

const UserProfile = ({ user }) => {
  return (
    <Container fluid className="profileContainer">
      <Row>
        <Col xs={12} className="profileContent">
          <div
            className="userAvatar"
            style={{
              background: 'url("' + defaultAvatar + '")'
            }}
          />
          <h1>Email: {user.email}</h1>
          <h2>Login: {user.login}</h2>
          <h3>
            Register at: {moment(user.createdAt).format("DD/MM/YYYY HH:mm")}
          </h3>
        </Col>
      </Row>
    </Container>
  );
};

export default connect(
  store => {
    return {
      user: store.auth.user
    };
  },
  {}
)(UserProfile);
