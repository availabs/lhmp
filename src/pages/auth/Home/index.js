import React from 'react'
import {connect} from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {authProjects, authGeoid} from "../../../store/modules/user";

import Element from 'components/light-admin/containers/Element'

import {sendSystemMessage} from 'store/modules/messages';
import get from "lodash.get"
import pick from "lodash.pick";



const ATTRIBUTES = [
     //'id',
     'contact_name',
    // 'contact_email',
   //  'contact_phone',
   //  'contact_address',
   //  'contact_title_role',
    // 'contact_department',
    // 'contact_agency',
    // 'contact_municipality',
   //  'contact_county',
     'associated_plan',
     'role_id',
     'participation_id',
     'status',
    // 'check_in'
]


const PATTRIBUTES = [
       'type', 
       //'plan_id', 
       //'owner_id', 
       'start_date', 
       'end_date', 
       //'hours', 
      // 'users', 
       //'roles', 
       'id'
]


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
  console.log('graph', state.graph)
  return ({
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid,
    userId: state.user.id || 'no user',
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        geoGraph: state.graph,
        email:state.user.email,
        userroleparticipationViewData : get(state.graph,['Users',state.user.email,'roles'],{}),
        userroleLength :  get(state.graph, ['users', state.user.email, 'roles', 'length'],{}),
        //userroleLength :  get(state.graph, `users.${state.user.email}.roles.length`,{}), //['users', state.user.email, 'roles', 'length'],{}),  
        // state.graph.users[state.user.email].roles.length
        participationViewData : get(state.graph,['participation','byId'],{})
        //userroleLength1 : state.graph.users.state.user.email.roles.length,
        //userroleStatus: get(state.graph,['Users',state.user.email,'roles', 0, 'status'],{})

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

