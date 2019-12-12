import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {createMatchSelector} from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import Analysis from './components/Analysis/'
import PlanningTeam from './components/planningTeam'
import Introduction from './components/introduction'
import LocalContext from './components/localContext/'
import HazardLoss from './components/hazardLoss/'
import HazardEvents from 'pages/Public/Hazards/components/hazardEvents/'
import NFIP from './components/NFIP'
import Assets from './components/Assets/'
import Narrative from './components/Strategy/Narrative'
import Goals from './components/Strategy/Goals'
import Capabilities from './components/Strategy/Capabilities'

class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    render() {
        return (
            <div>
                <Introduction/>
                <LocalContext/>
                <PlanningTeam/>
                <Analysis/>
                <HazardEvents/>
                <NFIP/>
                <Assets />
                <Narrative />
                <Goals />
                <Capabilities />
            </div>
        )
    }
}

    //  
    // 
    // 
    // 
                    
               

const mapStateToProps = (state, ownProps) => {
    return {
        graph: state.graph.plans || {},
        router: state.router
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-home',
    path: '/',
    exact: true,
    name: 'Home',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        {name: 'Home', path: '/'},
        {param: 'geoid', path: '/'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

