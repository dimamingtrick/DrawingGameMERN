import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AuthSpinner from "./components/Preloaders/AuthSpinner";
import DashboardContainer from "./pages/DashboardContainer/DashboardContainer";
import AuthContainer from "./pages/AuthContainer/AuthContainer";
import { Switch, Route, Redirect } from "react-router-dom";
import { authenticate } from "./actions/auth";

const Root = ({ isLoggedIn, authenticate }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = async () => {
    await authenticate();
    setIsInitialized(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized) return <AuthSpinner />;

  return (
    <div className="App">
      <Switch>
        <Redirect exact from="/" to={isLoggedIn ? "/app" : "/auth"} />
        <Route path="/app" component={DashboardContainer} />
        <Route
          path="/auth"
          children={props => (
            <AuthContainer {...props} isLoggedIn={isLoggedIn} />
          )}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};

export default connect(
  store => {
    return {
      isLoggedIn: store.auth.isLoggedIn,
    };
  },
  { authenticate }
)(Root);
