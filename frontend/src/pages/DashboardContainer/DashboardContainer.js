import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import HomePage from "../HomePage/HomePage";
import GamePage from "../GamePage/GamePage";
import ChatsPage from "../ChatsPage/ChatsPage";
import ToDoListPage from "../ToDoListPage/ToDoListPage";
import GameWordsPage from "../GameWordsPage/GameWordsPage";
import UserProfilePage from "../UserProfilePage/UserProfilePage";

import DashboardNavbar from "../../components/NavBar/DashboardNavbar";
import "./dashboard-container.css";
import socketIOClient from "socket.io-client";

let socket = null;
const serverUrl = `${process.env.REACT_APP_SERVER}/`;

const routes = [
  "/app",
  "/app/game",
  "/app/about",
  "/app/todolist",
  "/app/game-words",
  "/app/profile"
];
let routeKey; // Define key to have transition only between 3 routes, declared below inside switch

const DashboardContainer = ({ isLoggedIn, userRole, location }) => {
  if (!isLoggedIn) return <Redirect to="/auth" />;

  /** Connecting to socket */
  if (!socket) {
    socket = socketIOClient(serverUrl);
    socket.on("socketWorks", ({ horray }) => console.log(horray)); // Check if socket works
  }

  /** Searching for key in routes array */
  routeKey = routes.find(
    i =>
      i === location.pathname ||
      (location.pathname.includes(i) && i !== "/app" && i !== "/app/game")
  );

  return (
    <div>
      <DashboardNavbar location={location} />
      <div className="dashboard-wrapper container-fluid">
        <TransitionGroup>
          <CSSTransition key={routeKey} classNames="slide" timeout={300}>
            <Switch location={location}>
              <Route exact path="/app" component={HomePage} />
              <Route path="/app/game" component={GamePage} />
              <Route path="/app/chats" component={ChatsPage} />
              <Route path="/app/todolist" component={ToDoListPage} />
              <Route
                path="/app/game-words"
                render={navProps =>
                  userRole === "admin" ? (
                    <GameWordsPage {...navProps} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route path="/app/profile" component={UserProfilePage} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export { socket };
export default connect(store => {
  return {
    isLoggedIn: store.auth.isLoggedIn,
    userRole: store.auth.user.role
  };
})(DashboardContainer);
