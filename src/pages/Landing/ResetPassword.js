import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import LandingNav from './components/LandingNav';

import { resetPassword } from 'store/modules/user';

import './ResetPassword.css';

class ResetPassword extends Component {
  state = {
    isLoading: false,
    email: '',
    redirectToReferrer: false
  };

  validateForm() {
    return this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  // Consider: How to handle API feedback "Email sent"
  handleSubmit = async event => {
    event.preventDefault();
    this.props.resetPassword(this.state);
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div
        style={{
          height: '100vh',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(to bottom right,rgb(110, 176, 194) 0px, rgb(63, 174, 205) 39%, rgb(52, 149, 176) 100%)'
        }}
      >
        <LandingNav />
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <div
            className="auth-box-w"
            style={{
              width: '33%',
              minWidth: '350px',
              maxWidth: '650px'
            }}
          >
            <h4 className="auth-header" style={{ paddingTop: 20 }}>
              NPMRDS Reset Password
            </h4>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="">Username</label>
                <input
                  id="email"
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  className="login-form-control"
                  placeholder="Enter your username"
                />
                <div className="pre-icon os-icon os-icon-user-male-circle" />
              </div>
              <div className="buttons-w">
                <button
                  className="btn btn-primary btn-lg btn-block"
                  disabled={!this.validateForm()}
                >
                  Request Password Reset
                </button>
                {this.state.isLoading ? <div> Loading </div> : ''}
              </div>
            </form>
            <div style={{padding: 15, float: 'right'}}>
            <Link to={'/login'}>Login</Link>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { resetPassword };

export default {
  icon: 'icon-map',
  path: '/reset-password',
  mainNav: false,

  component: connect(
    null,
    mapDispatchToProps
  )(ResetPassword),
  menuSettings: { hide: true }
};
