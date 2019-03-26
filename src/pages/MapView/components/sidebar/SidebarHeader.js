import React, {Component} from 'react';
import { connect } from 'react-redux';

// import deepEqual from 'deep-equal'

 class SidebarHeader extends Component {
  
  render() {
    const { theme } = this.props
    let sidebarHeaderStyle = {
      width: '100%',
      flexBasis: 55,
      display: 'flex',
      padding: 15,
      backgroundColor: theme.sidePanelHeaderBg// '#323c58', //'#29323C'
    }


    return (
      <div className='sidebar-header' style={sidebarHeaderStyle}>
        <h5 style={{color: theme.textColor}}>MAP VIEW | TIG</h5>
      </div>
    );
  }
}

// SidebarHeader.defaultProps = {
//   isOpen: true
// }

const mapDispatchToProps = {}

const mapStateToProps = state => {
  return {
    theme: state.map.theme
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader)