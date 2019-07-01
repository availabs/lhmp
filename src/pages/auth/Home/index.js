import React from 'react'
import {connect} from 'react-redux'
import {authProjects} from "../../../store/modules/user";
// import { Link } from 'react-router-dom'

import Element from 'components/light-admin/containers/Element'



class HomeView extends React.Component {

  constructor (props) {
    super(props)
  }


  render() {
    /*
    var title ='Home';
    var subheader = 'Dashboard';
     */
    console.log('authProjects props',this.props);
    return(
      <div className='container'>
        <Element>
        <form onSubmit={this.handleSubmit}>
        <h4  className="element-header">Mitigation Planner Home</h4>
        <h4>Home Page for {this.props.activePlan}</h4>
        </form>
        </Element>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.user.authed,
  activePlan: state.user.activePlan // so componentWillReceiveProps will get called.
});

const mapDispatchToProps = ({
  //sendSystemMessage
  authProjects
});

export default {
  icon: 'os-icon-home',
  path: '/',
  exact: true,
  mainNav: true,
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-light',
    position: 'menu-position-left',
    layout: 'menu-layout-compact',
    style: 'color-style-default'
  },
  name: 'Home',
  auth: true,
  component: connect(mapStateToProps,mapDispatchToProps)(HomeView)
};

