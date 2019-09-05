import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter,Switch } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import theme from 'components/common/themes/dark';

import { auth } from './store/modules/user';

import Layout from './layouts/Layout';
import Routes from './routes';
import Messages from './components/messages';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    if(this.props.token){
      localStorage.setItem('userToken', this.props.token.slice(3,this.props.token.length))
      //alert('setting this: ' + this.props.token)
    }
    //alert('getItem: ' + localStorage.getItem('userToken'));
    this.props.auth();
    this.state = {
      isAuthenticating: true
    };
    this.getUrlVars = this.getUrlVars.bind(this)
  }


  componentDidUpdate(prevProps) {
    //console.log('update',prevProps, this.props.user.attempts)
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }

  componentWillMount(prevProps) {
    //alert('getItem: ' + localStorage.getItem('userToken'));
    this.props.auth();
    //console.log('update',prevProps, this.props.user.attempts)
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }
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
          </BrowserRouter>
          <Messages />
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  console.log('state', state.router.location, state.user)
  return ({
    user: state.user,
    router: state.router,
    token: state.router.location.search ? state.router.location.search : null
  });
}

const mapDispatchToProps = { auth };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
