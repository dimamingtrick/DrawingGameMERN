import React from "react";
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { Nav, NavItem } from 'reactstrap';
import { Link } from "react-router-dom";

const DashboardNavbar = ({ logout }) => {
  return (
    <Nav>
      <NavItem>
        <Link className="nav-link" to="/app">Home</Link>
      </NavItem>
      <NavItem>
        <Link className="nav-link" to="/app/about">About</Link>
      </NavItem>
      <NavItem>
        <Link className="nav-link" to="/app/todolist">To Do List</Link>
      </NavItem>
      <NavItem>
        <Link
          className="nav-link"
          to="/"
          onClick={logout}
        >
          Logout
        </Link>
      </NavItem>
    </Nav>
  );
};

export default connect(null, { logout })(DashboardNavbar);
