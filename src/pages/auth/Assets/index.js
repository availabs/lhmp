import React from 'react'
import { Link } from 'react-router-dom'


import Element from 'components/light-admin/containers/Element'

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
    return (
      <div className='container'>
        <Element>
        <h4  className="element-header">Assets</h4>
        </Element>
      </div>
    )
  }
}

export default [{
  icon: 'os-icon-home',
  path: '/assets',
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
}];

