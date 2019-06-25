import React from 'react'
import { Link } from 'react-router-dom'


// import RouteComparisonStore from 'react/stores/RouteComparisonStore'
// import RouteComparisonActions from 'react/actions/RouteComparisonActions'

// import RouteDataStore from 'react/stores/RouteDataStore'

// import NotificationsStore from 'react/stores/NotificationsStore'
// import NotificationsActions from 'react/actions/NotificationsActions'

// import UserActions from 'react/actions/UserActions'
// import { HomeViewTemplateModal } from './ReportLauncher'
import Element from 'components/light-admin/containers/Element'

import HomeNav from './components/HomeNav'
// import QuickReports from './QuickReports'
// import HomeActivity from './HomeActivity'
// import Guide from './Guide'

// const $ = window.$



class HomeView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      page: 'dashboard'
    }
    // this.onChange = this.onChange.bind(this)
    // this.changePage = this.changePage.bind(this)
    // this.selectHomeViewTemplate = this.selectHomeViewTemplate.bind(this)
  }
  render () {
    var title, subheader, content

      title = 'Home'
      subheader = 'Dashboard'



    return (
      <div className='container'>
        <Element>
        <h4  className="element-header">Mitigation Planner Home</h4>
        </Element>
      </div>
    )
  }
}

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
  component: HomeView
};

