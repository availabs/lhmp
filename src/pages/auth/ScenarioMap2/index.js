import React from 'react';
import AvlMap from 'components/AvlMap';
import CountiesLayerFactory from 'pages/auth/ScenarioMap2/layers/scenarioMap2.js'
import ControlLayersFactory from 'pages/auth/ScenarioMap2/layers/controlLayers.js'
// import ScenarioLayerFactory from 'pages/auth/ScenarioMap2/layers/scenarioLayer.js'
//import ZoneLayerFactory from 'pages/auth/ScenarioMap2/layers/zoneLayer.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
class Home extends React.Component {
    //CountiesLayer = CountiesLayerFactory();
    ControlLayers = ControlLayersFactory();
    // scenario = ScenarioLayerFactory();
    //zone = ZoneLayerFactory();

    render() {
        return (
            <div style={ { width: '100%', height: '100vh' } }>
                <AvlMap
                    layers={ [this.ControlLayers,
                        //this.zone,
                        //this.scenario
                    ] }
                    zoom={ 13 }
                    center={ [-73.7749, 42.6583] }
                    styles={[
                        { name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        { name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                />
            </div>
        )
    }

}


const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
    });

const mapDispatchToProps = {
    //sendSystemMessage
};

export default {
    path: '/scenario_map_2',
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
    name: 'Scenario Map 2',
    auth: true,
    component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(Home))
}