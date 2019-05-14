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
  DropdownMenu
} from "reactstrap";
import { Link } from "react-router-dom";
import "./navbars.css";

const navLinks = [
  {
    text: "Home",
    link: "/app",
    permissions: ["all"]
  },
  {
    text: "Game",
    link: "/app/game",
    permissions: ["all"]
  },
  {
    text: "Words to guess",
    link: "/app/game-words",
    permissions: ["admin"]
  },
  {
    text: "About",
    link: "/app/about",
    permissions: ["all"]
  },
  {
    text: "To do list",
    link: "/app/todolist",
    permissions: ["all"]
  }
];

const DashboardNavbar = ({ user, logout, location }) => {
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
          {navLinks.map(nav =>
            nav.permissions.find(i => i === user.role || i === "all") ? (
              <NavItem
                className={nav.link === location.pathname ? "active" : ""}
                key={`${nav.text}-${nav.link}`}
              >
                <Link className="nav-link" to={nav.link}>
                  {nav.text}
                </Link>
                <div className="linkUnderline" />
              </NavItem>
            ) : null
          )}

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              {user.login}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link className="dropdown-link" to="/app/profile">
                  My Profile
                </Link>
              </DropdownItem>
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
      user: store.auth.user
    };
  },
  { logout }
)(DashboardNavbar);
