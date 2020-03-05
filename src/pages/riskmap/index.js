import React from 'react';
import AvlMap from 'components/AvlMap';
import EBRFactory from 'components/AvlMap/layers/ebr_buildings_new'
import RiverineRiskZoneFactory from 'components/AvlMap/layers/riverine_risk_zones'
class Home extends React.Component {
  EBRLayer = EBRFactory();
  RiverineRiskZoneLayer = RiverineRiskZoneFactory();
  render() {
    return (
      <div style={ { width: '100%', height: '100vh' } }>
        <AvlMap
          layers={ [this.EBRLayer,this.RiverineRiskZoneLayer] }
          zoom={ 13 }
          center={ [-73.7749, 42.6583] }/>
      </div>
    )
  }
}

export default {
	path: '/scenario',
  icon: 'os-icon-map',
	exact: true,
	mainNav: false,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
  name: 'Scenarios (depracted)',
	auth: true,
	component: Home
}
