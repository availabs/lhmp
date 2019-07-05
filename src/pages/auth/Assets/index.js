import React from 'react'
import { Link } from 'react-router-dom'


import Element from 'components/light-admin/containers/Element'
import AssetsTable from 'pages/auth/Assets/components/AssetsTable'
// import QuickReports from './QuickReports'
// import HomeActivity from './HomeActivity'
// import Guide from './Guide'

// const $ = window.$



class AssetsIndex extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      page: 'dashboard',
      geoid: 36001
    }

  }
  render () {
    return (
      <div className='container'>
        <Element>
          <AssetsTable geoid={[this.state.geoid]}></AssetsTable>
        </Element>
      </div>
    )
  }
}

export default [{
  icon: 'os-icon-pencil-2',
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
  name: 'Assets',
  auth: true,
  component: AssetsIndex
}];

