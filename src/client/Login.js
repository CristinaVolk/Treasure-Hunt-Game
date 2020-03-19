import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.addNewUser = this.addNewUser.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  addNewUser = event => {
    event.preventDefault();
    this.props.onUser(event.target.value);
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.onHandleSubmit();
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ fontSize: `24px` }}>
        <label>
          Name :
          <input
            type="text"
            value={this.props.name}
            onChange={this.addNewUser}
            style={{ fontSize: `24px` }}
          />
        </label>
        <input style={{ fontSize: `24px` }} type="submit" value="Submit" />
      </form>
    );
  }
}
export default Login;
