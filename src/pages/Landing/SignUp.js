import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';

import LandingNav from './components/LandingNav'

import { signup } from 'store/modules/user';


import './Login.css'

class Signup extends Component {
  state = {
      isLoading: false,
      email: '',
      email_verify: '',
      redirectToReferrer: false
  }
  
  validateForm() {
    return this.state.email.length > 0 && this.state.email === this.state.email_verify;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.props.signup(this.state.email);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.setState({ redirectToReferrer: true });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render () {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      
      <div style={{
        height:'100vh', 
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to bottom right,rgb(110, 176, 194) 0px, rgb(63, 174, 205) 39%, rgb(52, 149, 176) 100%)'}}
      >
        <LandingNav />
        <div style={{height: '100%',  
          display: 'flex', 
          flexDirection:'column', 
          justifyContent:'center',
          alignItems: 'flex-start' }}> 
        	<div className="auth-box-w" style={{
            width: '33%',
            minWidth: '350px',
            maxWidth: '650px'
          }}>
         
          <h4 className="auth-header" style={{paddingTop: 20}}>NPMRDS Sign Up</h4>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor=''>Email</label>
              <input
                id="email"
                autoFocus
                type="email"
                
                value={this.state.email}
                onChange={this.handleChange}
                className="login-form-control"
                placeholder="Enter your email"
              />
              <div className="pre-icon os-icon os-icon-user-male-circle" />
            </div>
            <div className="form-group">
              <label htmlFor=''>Verify Email</label>
              <input
                value={this.state.email_verify}
                onChange={this.handleChange}
                id="email_verify"
                type="email"
                className="login-form-control"
                placeholder="Enter your password"
              />
              <div className="pre-icon os-icon os-icon-email-2-at2" />
            </div>
            <div className="buttons-w">
              <button className="btn btn-primary btn-lg btn-block" disabled={!this.validateForm()}>Sign Up</button>
              {
                this.state.isLoading ? 
                (<div> Loading </div>) : ''
              }
            </div>
          </form>
          <div style={{padding: 15, float: 'right'}}>
            <Link to={'/login'}>Login?</Link>
          </div>
          </div>
        </div>
      </div>
     
    )
  }
}

const mapDispatchToProps = { signup };

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
  };
};
 
export default
{
  path: '/signup',
  mainNav: false,
  component: connect(mapStateToProps, mapDispatchToProps)(Signup),
  menuSettings: {hide: true}
}

  