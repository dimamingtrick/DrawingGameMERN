import React from "react";

export default class HomePage extends React.Component {
  state = {
    load: true
  };

  _ismounted = true;

  componentDidMount() {
    // api({ method: "GET", url: "/todos" }).then(res => {
    //   if (this._ismounted)
    //     this.setState({ load: false, message: res.message })
    // })
  }

  render() {
    return (
      <div>
        <h1>Home page</h1>
        {!this.state.load && <h3>{this.state.message}</h3>}
      </div>
    );
  }
}
