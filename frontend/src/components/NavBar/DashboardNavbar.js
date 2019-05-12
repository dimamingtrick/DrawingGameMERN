import React, { useState } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import {
  Nav,
  NavItem,
  Navbar,
  NavbarToggler,
  Collapse,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./navbars.css";

const DashboardNavbar = ({ user, logout }) => {
  const [toggleState, setToggleState] = useState(false);

  const toggleNavbar = () => {
    setToggleState(!toggleState);
  };

  return (
    <Navbar color="dark" expand="md">
      <NavbarBrand href="/" className="mr-auto">
        MERN-stack Game
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={toggleState} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="/app">
              Home
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/app/game">
              Game
            </Link>
          </NavItem>
          {user.role === "admin" && (
            <NavItem>
              <Link className="nav-link" to="/app/game-words">
                Game Words
              </Link>
            </NavItem>
          )}
          <NavItem>
            <Link className="nav-link" to="/app/about">
              About
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/app/todolist">
              To Do List
            </Link>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {user.login}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>{user.email}</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={logout}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default connect(
  store => {
    return {
      user: store.auth.user,
    };
  },
  { logout }
)(DashboardNavbar);
