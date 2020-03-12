import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    username: "",
    isUser: false
  };

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  addNewUser(event) {
    event.preventDefault();
    if (this.state.username.length > 0) {
      this.props.onUser(this.state.isUser);
      this.setState({ isUser: true });
    } else {
      alert("You should provide your name");
    }
  }

  render() {
    return (
      <form onSubmit={this.addNewUser}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default Login;
