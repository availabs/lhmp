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
import HazardEvents from './components/hazardEvents/'
import NFIP from './components/NFIP'
import Assets from './components/Assets/'

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
                <Analysis/>
                <PlanningTeam/>
                <LocalContext/>
                <HazardLoss/>
                <HazardEvents/>
                <NFIP/>
                <Assets/>
            </div>
        )
    }
}

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
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

