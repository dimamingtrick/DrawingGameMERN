import React from "react";
import RegistrationPage from "../RegistrationPage/RegistrationPage";
import LoginPage from "../LoginPage/LoginPage";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthNavbar from "../../components/NavBar/AuthNavbar";

const AuthContainer = ({ isLoggedIn }) => {
  if (isLoggedIn) return <Redirect to="/app" />;

  return (
    <div>
      <AuthNavbar />
      <Switch>
        <Redirect exact from='/auth' to="/auth/login" />
        <Route exact path="/auth/login" component={LoginPage} />
        <Route path="/auth/registration" component={RegistrationPage} />
        <Route render={() => <Redirect to="/auth" />} />
      </Switch>
    </div>
  );
};

export default AuthContainer;
