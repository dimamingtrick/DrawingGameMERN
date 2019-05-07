import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem } from 'reactstrap';

const AuthNavbar = () => {
  return (
    <Nav>
      <NavItem>
        <Link className="nav-link" to="/auth/login">Login</Link >
      </NavItem >
      <NavItem>
        <Link className="nav-link" to="/auth/registration">Registration</Link>
      </NavItem>
    </Nav >
  );
};

export default AuthNavbar;
