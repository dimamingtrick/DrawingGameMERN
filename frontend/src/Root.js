import React from "react";
import { connect } from "react-redux";
import DashboardContainer from "./pages/DashboardContainer/DashboardContainer";
import AuthContainer from "./pages/AuthContainer/AuthContainer";
import { Switch, Route, Redirect } from "react-router-dom";
import { authenticate } from "./actions/auth";

class Root extends React.Component {
  state = {
    initialized: false,
  };

  componentDidMount() {
    this.props.authenticate().then(res => {
      this.setState({ initialized: true });
    });
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div className="App">
        <Switch>
          <Redirect exact from="/" to={isLoggedIn ? "/app" : "/auth"} />
          <Route
            path="/app"
            children={props => (
              <DashboardContainer {...props} isLoggedIn={isLoggedIn} />
            )}
          />
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
  }
}

export default connect(
  store => {
    return {
      isLoggedIn: store.auth.isLoggedIn,
    };
  },
  { authenticate }
)(Root);
