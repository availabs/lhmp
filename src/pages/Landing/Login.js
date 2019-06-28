import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import {falcorGraph} from "store/falcorGraph";

import LandingNav from './components/LandingNav'

import { login } from 'store/modules/user';


import './Login.css'

class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    redirectToReferrer: false
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.props.login(this.state);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.setState({ redirectToReferrer: true });
    } else {
      this.setState({ isLoading: false });
    }
  }

  /*
  componentWillMount(){
    if(this.props.user.authLevel <10){
      this.fetchFalcorDeps()
    }
  }

  fetchFalcorDeps(){
    return falcorGraph.get(['plans','county','byId',['3'],'fips'])
        .then(response =>{
          console.log('response',response)
        })
  }
   */

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

              <h4 className="auth-header" style={{paddingTop: 20}}>LHMP Login</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor=''>Username</label>
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
                <div className="form-group">
                  <label htmlFor=''>Password</label>
                  <input
                      value={this.state.password}
                      onChange={this.handleChange}
                      id="password"
                      type="password"
                      className="login-form-control"
                      placeholder="Enter your password"
                  />
                  <div className="pre-icon os-icon os-icon-fingerprint" />
                </div>
                <div className="buttons-w">
                  <button className="btn btn-primary btn-lg btn-block" disabled={!this.validateForm()}>Log me in</button>
                  {
                    this.state.isLoading ?
                        (<div> Loading </div>) : ''
                  }
                </div>
              </form>
              <div style={{padding: 15, float: 'right'}}>
                <Link to={'/signup'}>Sign Up</Link>
                {' | '}
                <Link to={'/reset-password'}>Forgot Password?</Link>
              </div>
            </div>
          </div>
        </div>

    )
  }
}

const mapDispatchToProps = { login };

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
  };
};

export default
{
  icon: 'icon-map',
  path: '/login',
  mainNav: false,

  component: connect(mapStateToProps, mapDispatchToProps)(Login),
  menuSettings: {hide: true}
}

  