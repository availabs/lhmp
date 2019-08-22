import React from 'react'
import {connect} from 'react-redux'
import {authProjects, authGeoid} from "../../../store/modules/user";
// import { Link } from 'react-router-dom'

import Element from 'components/light-admin/containers/Element'



class HomeView extends React.Component {

  constructor (props) {
    super(props)
  }


  render() {
    /*
    var title ='Home';
    var subheader = 'Dashboard';setActivePlan
     */
    return(
      <div className='container'>
        <Element>
        <form>
        <h4  className="element-header">Mitigation Planner Home</h4>
        <h6>Home Page for {this.props.activePlan} {this.props.activeGeoid}</h6>
        </form>
        </Element>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log('user', state.user)
  return ({
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid
  });
}

const mapDispatchToProps = ({
  //sendSystemMessage
  //authProjects,
  //authGeoid

});

export default {
  icon: 'os-icon-home',
  path: '/',
  exact: true,
  mainNav: true,
  breadcrumbs: [
    { name: 'Home', path: '/' }
  ],
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

