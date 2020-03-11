import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

class Login extends Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
  }
  state = {
    username: "",
    isUser: false
  };

  addNewUser = () => {
    this.props.onUser(this.state.isUser);
    this.setState({ isUser: true });
  };

  render() {
    return (
      <div>
        <div>
          <TextField
            placeholder="Enter your Username"
            label="Username"
            onChange={(event, newValue) =>
              this.setState({ username: newValue })
            }
          />
          <br />

          <br />
          <button
            label="Submit"
            color="primary"
            onClick={this.addNewUser}
          ></button>
        </div>
      </div>
    );
  }
}
const style = {
  margin: 15
};
export default Login;
