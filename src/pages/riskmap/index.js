import React, { Component } from 'react';
import AvlMap from 'components/AvlMap';
import ebr_buildings from './layers/ebr_buildings_new'

const EBRLayer = ebr_buildings()

class Home extends Component {
  render () {
   return (
     <div style={ { width: '100%', height: '100vh' } }>
      <AvlMap
        layers={ [EBRLayer] }
        zoom={ 13 }
        center={ [-73.7749, 42.6583] }
       />
     </div>
    )
  }
}

export default {
	path: '/scenario',
  icon: 'os-icon-map',
	exact: true,
	mainNav: true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
  name: 'Scenarios',
	auth: true,
	component: Home
}
