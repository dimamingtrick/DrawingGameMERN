import React from "react";
import HomePage from "../HomePage/HomePage";
import GamePage from "../GamePage/GamePage";
import AboutPage from "../AboutPage/AboutPage";
import ToDoListPage from "../ToDoListPage/ToDoListPage";
import { Switch, Route, Redirect } from "react-router-dom";
import { SlideFromRight } from "../../components/Animations/RoutingAnimationTransitions";
import DashboardNavbar from "../../components/NavBar/DashboardNavbar";
import "./dashboard-container.css";

const routes = ["/app", "/app/game", "/app/about", "/app/todolist"];
let routeKey; // Define key to have transition only between 3 routes, declared below inside switch

const DashboardContainer = ({ isLoggedIn, location }) => {
  if (!isLoggedIn) return <Redirect to="/auth" />;

  routeKey = routes.find(
    i =>
      i === location.pathname || (location.pathname.includes(i) && i !== "/app")
  );

  return (
    <div>
      <DashboardNavbar />
      <div className="dashboard-wrapper container-fluid">
        <SlideFromRight routeKey={routeKey}>
          <Switch location={location}>
            <Route exact path="/app" component={HomePage} />
            <Route path="/app/game" component={GamePage} />
            <Route path="/app/about" component={AboutPage} />
            <Route path="/app/todolist" component={ToDoListPage} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </SlideFromRight>
      </div>
    </div>
  );
};

export default DashboardContainer;
