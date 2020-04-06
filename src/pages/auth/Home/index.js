import React from 'react'
import {connect} from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {authProjects, authGeoid} from "../../../store/modules/user";

import Element from 'components/light-admin/containers/Element'

import {sendSystemMessage} from 'store/modules/messages';
import get from "lodash.get"
import pick from "lodash.pick";



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



      </div>
    )
  }
}




const mapStateToProps = state => {
  return ({
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid
  });
}

const mapDispatchToProps = ({
  sendSystemMessage
  //authProjects,
  //authGeoid

});

export default {
  icon: 'os-icon-home',
  path: '/admin',
  exact: true,
  mainNav: true,
  breadcrumbs: [
    { name: 'Home', path: '/admin' }
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
  component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(HomeView))
};

