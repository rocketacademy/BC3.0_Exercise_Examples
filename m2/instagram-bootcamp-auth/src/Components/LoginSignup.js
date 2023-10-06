import React from "react";

// Login Signup form, is passed its function handlers as props.
export default class LoginSignup extends React.Component {
  render() {
    return (
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={this.props.email}
          name="email"
          onChange={this.props.handleChange}
          placeholder="Add your email here"
        />
        <label>Password:</label>
        <input
          type="text"
          value={this.props.password}
          name="password"
          onChange={this.props.handleChange}
          placeholder="Add your password here"
        />
        <button onClick={this.props.handleSignup}>Signup</button>
        <button onClick={this.props.handleLogin}>Login </button>
      </div>
    );
  }
}
