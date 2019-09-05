import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
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
            <div className='container'>
                <Element>
                    <h4 className="element-header">{
                        Object.keys(this.props.graph).length > 0
                        && this.props.graph.county && this.props.graph.county.byId
                        && this.props.graph.county.byId[this.state.activePlan]
                        && this.props.graph.county.byId[this.state.activePlan].county
                            ? this.props.graph.county.byId[this.state.activePlan].county.value
                            : 'Loading'} page</h4>
                    <div className="row">
                        <div className="col-sm-8 col-xxxl-6">
                            <div className="element-wrapper">
                                <div className="element-box">

                                </div>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    console.log('public home state', state)
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
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

