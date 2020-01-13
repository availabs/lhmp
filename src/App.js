import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter,Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import theme from 'components/common/themes/light_new';

import { auth } from 'store/modules/user';


import Layout from 'layouts/Layout';
import Routes from 'routes';
import Messages from 'components/messages';
import ScrollToTop from 'utils/ScrollToTop'

import './App.css';
import Redirect from "react-router/Redirect";

const history = createBrowserHistory();


class App extends Component {
  constructor(props) {
    super(props);
//console.log("PROPS:", props)
    if(this.props.token){
//console.log("USER TOKEN:", this.props.token)
      localStorage.setItem('userToken', this.props.token.slice(3,this.props.token.length))
    }
    this.props.auth();
    this.state = {
      isAuthenticating: true
    };
    this.props.auth();
    //console.log('update',prevProps, this.props.user.attempts)
    
    this.getUrlVars = this.getUrlVars.bind(this)
  }


  componentDidUpdate(prevProps) {
    //console.log('update',prevProps, this.props.user.attempts)
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }

  // componentWillMount(prevProps) {
  //   //alert('getItem: ' + localStorage.getItem('userToken'));
    
  // }
  getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
  render() {
    //console.log('app render user',this.props.user)

    return (
      <ThemeProvider theme={theme}>
        <div className="all-wrapper solid-bg-all">
          <BrowserRouter>
            <ScrollToTop>
              <Switch>
                {
                    Routes.routes.map((route, i) => {
                      return (
                          <Layout
                              {...route}
                              authed={this.props.user.authed}
                              userAuthLevel={this.props.user.authLevel}
                              breadcrumbs={route.breadcrumbs}
                              isAuthenticating={this.state.isAuthenticating}
                              key={i}
                              menuSettings={route.menuSettings ? route.menuSettings : {}}
                              menus={Routes.routes
                                  .filter(f => route.auth === f.auth)}
                                  //.filter(f => f.auth && f.authLevel ? f.authLevel <= this.props.user.authLevel : true)}
                              router={this.props.router}
                              routes={Routes.routes}
                              user={this.props.user}
                          />
                      );
                    })
                }
              </Switch>
            </ScrollToTop>
          </BrowserRouter>
          <Messages />
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return ({
    user: state.user,
    router: state.router,
    token: state.router.location.search ? state.router.location.search : null
  });
}

const mapDispatchToProps = { auth, createBrowserHistory };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
