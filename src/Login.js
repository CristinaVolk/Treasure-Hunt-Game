import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    name: "",
    isUser: false
  };

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  addNewUser(event) {
    event.preventDefault();
    if (this.state.name.length === 0) alert("You should provide your name");
    else {
      fetch(`/login?name=${encodeURIComponent(this.state.name)}`)
        .then(response => response.json())
        .then(state => this.setState(state));

      this.props.onUser(this.state.isUser);
      this.setState({ isUser: true });
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
