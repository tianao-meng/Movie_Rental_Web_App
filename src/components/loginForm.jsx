import React, { Component } from "react";

import Joi, { abort } from "joi-browser";
import Form from "./common/form";
import { render } from "@testing-library/react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  //   componentDidMount() {
  //     this.username.current.focus();
  //   }

  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      //full reload the app

      const { state } = this.props.location;

      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;

        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    //console.log(this.errors);
    //console.log(this);
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
