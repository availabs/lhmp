import React, {Component} from 'react';

// import { selectTMCs, setInspectTMC } from './store/MapStore'

import deepEqual from 'deep-equal'
import {MAPBOX_TOKEN} from 'store/config'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { select, setHover, setActiveTMCS, setEpoch } from './map_functions'
import { initializeMap } from './store/MapStore'

import { connect } from 'react-redux';

import Sidebar from './components/sidebar'
import Infobox from './components/infobox/Infobox'
import SliderContainer from './components/slider/slider-container'

import './incidents.css'

let map = null

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapId: this.props.mapId || 'map1'
    };
  }

  shouldComponentUpdate(nextProps,nextState) {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // if( !deepEqual(this.props.data, nextProps.data) ) {
    //   this.setState({data: nextProps.data})
    // }

    if(map && !deepEqual(this.props.activeTMCS, nextProps.activeTMCS)){
      setActiveTMCS(map,nextProps.activeTMCS,nextProps.tmcData, nextProps.epoch, nextProps.date, nextProps.domain, nextProps.range)
    }

    if(this.props.activeTMCS.length > 0 && this.props.epoch != nextProps.epoch) {
      setEpoch(map, this.props.activeTMCS, this.props.tmcData, nextProps.epoch, nextProps.date, nextProps.domain, nextProps.range)
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    mapboxgl.accessToken = MAPBOX_TOKEN
    map = new mapboxgl.Map({
      container: this.state.mapId,
      style: 'mapbox://styles/am3081/cjms1pdzt10gt2skn0c6n75te',
      center: [-73.979531, 40.758700],
      minZoom: 2,
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.on('load',  () => {
      this.props.initializeMap(map)
      // map.addSource("npmrds", {
      //     type: 'vector',
      //     url: 'mapbox://am3081.bwf8aacc'
      // }); 
    })
    
      
    
  }

  _resize() {
    let style = window.getComputedStyle(document.getElementById(this.state.mapId), null)
  }
 
  render() {
    return (
      <div id={this.state.mapId} style={{width: '100%', height: '100vh'}}>
        <Sidebar />
        <Infobox />
        
      </div>
    );
  }
}

const mapDispatchToProps = { 
  initializeMap
};

const mapStateToProps = state => {
  return {
    layers:state.map.layer
  };
};

export default {
	icon: 'os-icon-map',
	path: '/',
	exact: true,
	mainNav: true,
  menuSettings: {
    display: 'none',
    image: 'none',
    scheme: 'color-scheme-dark', 
    position: 'menu-position-left',
    layout: 'menu-layout-mini',
    style: 'color-style-default'  
  },
  name: 'MapView',
	auth: false,
	component: connect(mapStateToProps, mapDispatchToProps)(MapView)
}
