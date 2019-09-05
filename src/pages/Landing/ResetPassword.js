import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'

import {resetPassword, setPassword} from 'store/modules/user';

import './ResetPassword.css';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: '',
            token: this.props.token,
            password: '',
            verify_password: '',
            redirectToReferrer: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    validateForm() {
        return this.state.token ? ((this.state.password === this.state.verify_password) && this.state.password.length > 0)
            : this.state.email.length > 0;
    }

    handleChange = event => {
      console.log( [event.target.id], event.target.value)
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    // Consider: How to handle API feedback "Email sent"
    handleSubmit = async event => {
        event.preventDefault();
        console.log('requested', this.state.email)
       this.state.token ?  this.props.setPassword(this.state)
           : this.props.resetPassword(this.state);
    };

    renderPasswordSet(){
      return(
          <form onSubmit={this.handleSubmit}>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    autoFocus
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className="login-form-control"
                    placeholder="Enter new password"
                />
                <div className="pre-icon os-icon os-icon-fingerprint" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="verify_password">Confirm Password</label>
                <input
                    id="verify_password"
                    type="password"
                    value={this.state.verify_password}
                    onChange={this.handleChange}
                    className="login-form-control"
                    placeholder="Confirm password"
                />
                <div className="pre-icon os-icon os-icon-fingerprint" />
              </div>
            </div>
            <div className="buttons-w">
              <button
                  className="btn btn-primary btn-lg btn-block"
                  disabled={!this.validateForm()}
              >
                Set password
              </button>
              {this.state.isLoading ? <div> Loading </div> : ''}
            </div>
          </form>
      )
    }

    renderPasswordReset(){
      return(
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="">Email</label>
              <input
                  id="email"
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  className="login-form-control"
                  placeholder="Enter your email"
              />
              <div className="pre-icon os-icon os-icon-user-male-circle"/>
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
      )
    }
    render() {
        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {redirectToReferrer} = this.state;
        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }

        return (
            <div style={{
                height: '100vh',
                overflow: 'scroll',
                backgroundImage: 'linear-gradient(142deg, rgba(255,255,255,1) 0%, rgba(238,240,245,1) 85%, rgba(4,123,248,.2) 100%)'
            }}
            >

                <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <div className="auth-box-w" style={{
                        width: '100%',
                        minWidth: '350px',
                        maxWidth: '650px'
                    }}>
                        <h4 className="auth-header" style={{paddingTop: 20}}>Hazard Mitigation Planner
                            <br/><span style={{fontSize: '0.8em', fontWeight: 100, color: '#047bf8'}}>Reset Password</span></h4>
                      { this.state.token ? this.renderPasswordSet() : this.renderPasswordReset() }

                        <div style={{padding: 15, float: 'right'}}>
                            <Link to={'/login'}>Login?</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {resetPassword, setPassword};
const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: !!state.user.authed,
        token: ownProps.computedMatch.params.token
    };
};
export default [{
    path: '/password/set/',
    mainNav: false,
    exact: true,
    name: 'ResetPassword',
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ResetPassword)),
    menuSettings: {hide: true},
  breadcrumbs: [
    { name: 'ResetPassword', path: '/password/set/' },
    { display: 'none'}
  ],
},
  {
    path: '/password/set/:token',
    mainNav: false,
    exact: true,
    name: 'ResetPassword',
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ResetPassword)),
    menuSettings: {hide: true},
    breadcrumbs: [
      { name: 'ResetPassword', path: '/password/set' },
    ],
  }];
