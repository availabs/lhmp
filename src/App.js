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
    this.props.auth();
    this.state = {
      isAuthenticating: true
    };
  }


  componentDidUpdate(prevProps) {
    //console.log('update',prevProps, this.props.user.attempts)
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }

  componentWillMount(prevProps) {
    //console.log('update',prevProps, this.props.user.attempts)
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }


  render() {
    //console.log('app render user',this.props.user)
    return (
      <ThemeProvider theme={theme}>
        <div className="all-wrapper solid-bg-all">
          <BrowserRouter>
            <Switch>
              {Routes.map((route, i) => {
                return (
                  <Layout
                    {...route}
                    authed={this.props.user.authed}
                    breadcrumbs={route.breadcrumbs}
                    isAuthenticating={this.state.isAuthenticating}
                    key={i}
                    menuSettings={route.menuSettings ? route.menuSettings : {}}
                    menus={Routes}
                    router={this.props.router}
                    routes={route.routes}
                    user={this.props.user}
                  />
                );
              })}
            </Switch>
          </BrowserRouter>
          <Messages />
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  router: state.router
});

const mapDispatchToProps = { auth };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
