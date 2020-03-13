import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    name: ""
  };

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  addNewUser(event) {
    event.preventDefault();
    if (this.state.name.length === 0) alert("You should provide your name");
    else {
      axios
        .post("http://localhost:3005/user", {
          name: this.state.name
        })
        .then(response => {
          console.log(response, "User added!");
        });

      this.props.onUser(this.state.name);
    }
  }

  render() {
    return (
      <form onSubmit={this.addNewUser}>
        <label>
          Name :
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
