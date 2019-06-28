import React from 'react'
import {connect} from 'react-redux'
import {activateProject} from "../../../store/modules/user";
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
    // console.log('active Project',this.props.activeProject)
    // console.log('activate Project',this.props.activateProject)
    // console.log('activeProject Props',this.props.dispatch(activateProject(3)))
    return(
      <div className='container'>
        <Element>
        <h4  className="element-header">Mitigation Planner Home</h4>
        </Element>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !!state.user.authed,
  activeProject: state.user.activeProject // so componentWillReceiveProps will get called.
});

const mapDispatchToProps = ({
  //sendSystemMessage
  activateProject
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

