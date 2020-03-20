import React from 'react';
import AvlMap from 'components/AvlMap';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'

import EvacuationRoutesFactory from "./layers/evacuationRoutesLayer";

class Home extends React.Component {
    evacuationRoutesLayer = EvacuationRoutesFactory({ active: true });
    render() {
        return (
            <div style={{width: '100%', height: '100vh'}}>
                <AvlMap
                    layers={[this.evacuationRoutesLayer
                    ]}
                    zoom={13}
                    center={[-73.7749, 42.6583]}
                    styles={[
                        {name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        {name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                    sidebar={false}
                />
            </div>
        )
    }

}


const mapStateToProps = state => (
    {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
    });

const mapDispatchToProps = {
    //sendSystemMessage
};

export default {
    path: '/evacuation_routes',
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
    name: 'Evacuation Routes',
    auth: true,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Home))
}