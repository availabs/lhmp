import React from 'react'
import {connect} from 'react-redux'
import {activateProject} from "../../../store/modules/user";

const PANELS = [
  {
    title: 'Create A Custom Route',
    text: 'Use route creation tool to create routes for analysis',
    tag: 'Create A Route',
    fill: 'fill-yellow',
    icon: 'fa-long-arrow-right',
    link: '/networks/creation?supressReload=true',
    // onClick: () => {
    //   browserHistory.push('')
    // }
  },
  {
    title: 'Design A Report',
    text: 'Use route comparison tool to create custom report',
    tag: 'Create A Report',
    fill: 'fill-green',
    icon: 'fa-file-text',
    link: '/networks'
  },
  {
    title: 'View Performance Measures',
    text: 'See custom reports on Map-21 performance measures',
    tag: 'View Measures',
    fill: 'fill-blue',
    icon: 'fa-bar-chart',
    link: '/pm3/ny'
  },
  {
    title: 'Analyze Incidents',
    text: 'Detailed view of daily data and Transcom Incidents.',
    tag: 'View Incidents',
    fill: 'fill-blue',
    icon: 'fa-bar-chart',
    link: '/incidents'
  }
]


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



  render() {
    /*
    var title ='Home';
    var subheader = 'Dashboard';
     */
  console.log('active Project',this.props.activeProject)
  console.log('activate Project',this.props.activateProject)
  //console.log('activeProject Props',this.props.dispatch(activateProject(3)))
  return(
    <div className='container'>
      Active Project is ${this.props.activeProject}
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
    scheme: 'color-scheme-dark',
    position: 'menu-position-left',
    layout: 'menu-layout-compact',
    style: 'color-style-default'
  },
  name: 'Home',
  auth: true,
  component: connect(mapStateToProps,mapDispatchToProps)(HomeView)
};

