import React from "react";
import api from "../../services/api";

export default class AboutPage extends React.Component {

  state = {
    load: true
  }

  _ismounted = true;

  componentDidMount() {
    api({ method: "GET", url: "/about-info" }).then(res => {
      if (this._ismounted)
        this.setState({ load: false, message: res.message })
    })
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    if (this.state.load)
      return (
        <h1>LOADING...</h1>
      );

    return (
      <React.Fragment>
        <h1>About page</h1>
        <h3>{this.state.message}</h3>
      </React.Fragment>
    );
  }
}
