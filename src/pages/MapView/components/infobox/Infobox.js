import React, {Component} from 'react';
import { connect } from 'react-redux';

import Legend from '../legend/legend'
import TMCInspector from './tmcInspector'

 class Sidebar extends Component {
  
  tmcDisplay () {
    return this.props.tmc ? <TMCInspector /> : <span />
  }

  render() {
    const { theme } = this.props
    let sideBarContainerStyle = {
      width: this.props.isOpen ? 400: 0,
      zIndex: 99,
      display: 'flex',
      transition: 'width 250ms',
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 20,
      paddingBottom: 30
    }

    let sidebarStyle = {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      transition: 'left 250ms, right 250ms',
      alignItems: 'stretch',
      flexGrow: 1
    }

    let sidebarInnerStyle = {
      backgroundColor: theme.sidePanelBg, //#242730
      borderRadius: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }

    let sidebarContentStyle = {
      flexGrow: 1,
      padding: 5,
      overflowY: 'auto',
      overflowX: 'hidden',
      color: '#efefef'
    }

    return (
      <div className='sidebar-container' style={sideBarContainerStyle}>
        <div className='sidebar' style={sidebarStyle}>
          <div className='sidebar-inner' style={sidebarInnerStyle}>
            <div className='sidebar-content' style={sidebarContentStyle}>
              <Legend />
              {this.tmcDisplay()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  isOpen: true
}

const mapDispatchToProps = {}

const mapStateToProps = state => {
  return {
    theme: state.map.theme
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)