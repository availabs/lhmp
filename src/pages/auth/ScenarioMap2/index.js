import React from 'react';
import AvlMap from 'components/AvlMap';
import CountiesLayerFactory from 'pages/auth/ScenarioMap2/layers/scenarioMap2.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
class Home extends React.Component {
    CountiesLayer = CountiesLayerFactory();

    render() {
        return (
            <div style={ { width: '100%', height: '100vh' } }>
                <AvlMap
                    layers={ [this.CountiesLayer] }
                    zoom={ 13 }
                    center={ [-73.7749, 42.6583] }/>
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