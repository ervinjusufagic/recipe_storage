import React, { Component } from "react";
import { Redirect } from "react-router-dom";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      token: "",
      redirect: false
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  submitLogin() {
    fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message !== "Auth failed") {
          this.setState({
            token: responseJson.token,
            redirect: true
          });
        } else {
          this.setState({
            redirect: false,
            error: true
          });
        }
      })

      .catch(error => {
        this.setState({
          redirect: false
        });
        console.error(error);
      });
  }

  render() {
    if (this.state.redirect === false) {
      return (
        <div>
          email: test@test.com, pw: test
          <form className="text-center">
            <p className="h4 text-center mb-4">Sign in</p>
            <label className="grey-text">Email</label>
            <input
              type="email"
              className="form-control"
              value={this.state.email}
              onChange={this.handleEmail}
            />
            <br />
            <label className="grey-text">Lösenord</label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handlePassword}
            />
          </form>
          <div className="text-center mt-4">
            {this.state.error ? (
              <label>Lösenord eller email passar inte </label>
            ) : (
              <label />
            )}
            <button
              className="btn btn-indigo"
              onClick={() => {
                this.submitLogin();
              }}
            >
              Login
            </button>
          </div>
        </div>
      );
    } else {
      return <Redirect to={{ pathname: "/", token: this.state.token }} />;
    }
  }
}

export { Login };
