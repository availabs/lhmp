import React, { Component } from 'react';
import AvlMap from 'components/AvlMap';
import ebr_buildings from './layers/ebr_buildings' //no need to put .js
import ogs_buildings from './layers/ogs_buildings' 
import osm_buildings from './layers/osm_buildings'
import parcels from './layers/parcels'


class Home extends Component {
  render () {
   return (
     <div style={{width: '100vw', height: '100vh'}}>
      <AvlMap
        layers={[ebr_buildings,ogs_buildings,osm_buildings,parcels]}
        zoom={13}
        center={[-73.7749, 42.6583]}
       />
     </div>
    )
  }
}

export default {
	path: '/scenario',
	exact: true,
	mainNav: true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
  name: 'Scenario Map',
	auth: true,
	component: Home
}