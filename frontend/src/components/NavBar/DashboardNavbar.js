import React, { useState } from "react";
import { connect } from "react-redux";
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

import { logout } from "../../actions/auth";
import defaultAvatar from "../../assets/defaultAvatar.png";
import "./navbars.css";

const navLinks = [
  {
    text: "Home",
    link: "/app",
    permissions: ["all"],
  },
  {
    text: "Game",
    link: "/app/game",
    permissions: ["all"],
  },
  {
    text: "Words to guess",
    link: "/app/game-words",
    permissions: ["admin"],
  },
  {
    text: "Chats",
    link: "/app/chats",
    permissions: ["all"],
    rightIcon: true,
  },
  {
    text: "To do list",
    link: "/app/todolist",
    permissions: ["all"],
  },
];

const DashboardNavbar = ({ user, logout, location, unreadChatsCount }) => {
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
                key={`${nav.text}-${nav.link}`}
                className={
                  location.pathname === nav.link ||
                  (location.pathname.includes(nav.link) &&
                    nav.link !== "/app" &&
                    nav.link !== "/app/game")
                    ? "active"
                    : ""
                }
              >
                <Link className="nav-link nav-bar-link" to={nav.link}>
                  {nav.text}
                  {nav.rightIcon && unreadChatsCount !== 0 && (
                    <div className="nav-right-icon">{unreadChatsCount}</div>
                  )}
                </Link>
                <div className="linkUnderline" />
              </NavItem>
            ) : null
          )}

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className="user-data-dropdown" nav caret>
              {user.login}{" "}
              <div
                className="navbar-avatar"
                style={{
                  background: `url('${user.avatar || defaultAvatar}')`,
                }}
              />
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
      user: store.auth.user,
      unreadChatsCount: store.chat.unreadChatsCount,
    };
  },
  { logout }
)(DashboardNavbar);
