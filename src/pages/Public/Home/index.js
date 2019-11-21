import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import Analysis from './components/Analysis/'
import PlanningTeam from './components/planningTeam'
import Introduction from './components/introduction'
import LocalContext from './components/localContext/'
import HazardLoss from './components/hazardLoss/'
const ATTRIBUTES = [
    "fips",
    "plan_consultant",
    "plan_expiration",
    "plan_grant",
    "plan_url",
    "plan_status",
    "groups",
    "id",
    "county",
    "subdomain"
]
class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    fetchFalcorDeps() {
        if(!(this.props.user.activePlan || this.props.user.activeGeoid)) return Promise.resolve();
        return this.props.user.activePlan ?
            this.props.falcor.get(['plans','county','byId',[this.props.user.activePlan],ATTRIBUTES])
            .then(planIdResponse => {
                console.log('plansRes', planIdResponse)
                return planIdResponse //.json.plans.county.byId[this.props.user.activePlan]
            })
            : this.props.user.activeGeoid ?
                this.props.falcor.get(['plans','county','byGeoid',[parseInt(this.props.user.activeGeoid)],'id'])
                    .then(planIdResponse => {
                        console.log('plansRes', planIdResponse.json.plans.county.byGeoid[this.props.user.activeGeoid].id)
                        this.setState({'activePlan':planIdResponse.json.plans.county.byGeoid[this.props.user.activeGeoid].id})
                        this.props.falcor.get(
                            ['plans','county','byId',[planIdResponse.json.plans.county.byGeoid[this.props.user.activeGeoid].id],ATTRIBUTES]
                        )
                            .then(planIdResponse => {
                                console.log('plansRes', planIdResponse)
                                return planIdResponse //.json.plans.county.byId[this.props.user.activePlan]
                            })
                    }) : Promise.resolve();
    }

    render() {
        return (
            <div>
                <Introduction/>
                <Analysis/>
                <PlanningTeam/>
                <LocalContext/>
                <HazardLoss/>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
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
        { name: 'Home', path: '/' },
        { param: 'geoid', path: '/' }
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

