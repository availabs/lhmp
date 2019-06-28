import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import {activateProject} from 'store/modules/user'


const ATTRIBUTES = [
    "id",
    "fips",
    "plan_consultant",
    "plan_expiration",
    "plan_grant",
    "plan_url",
    "plan_status",
    "groups"
]

class PlanPage extends React.Component {

    constructor(props){
        super(props)

        this.state={
            plan_data: [],
            id:''
        }

    }
    componentDidMount(e) {
        this.fetchFalcorDeps();
    }

    componentWillMount(){
        this.fetchFalcorDeps().then(response =>{
            this.setState({
                plan_data : response
            })
        })

    }

    fetchFalcorDeps() {
        let plan_data =[];
        return falcorGraph.get(['plans','county','byId', [this.props.match.params.countyPlanId], ATTRIBUTES])
            .then(response => {
                Object.keys(response.json.plans.county.byId).filter(d => d!== '$__path').forEach(function(plan,i){
                    plan_data.push({
                        'id' : plan,
                        'data': Object.values(response.json.plans.county.byId[plan])
                    })
                })
                return plan_data
            })

    }

    // onPlanClick (planId) {
    //     this.props.act
    // }

    render() {
        console.log('props',this.props.activateProject)
        let table_data = [];
        let attributes = ATTRIBUTES.slice(1)
        this.state.plan_data.map(function (each_row) {
            table_data = each_row.data.slice(2)
        });

        return (
            <div>
                <Element>
                    <h6 className="element-header">County Plans</h6>
                    <div className="element-box">
                        Welcome to the County Plan Page : {table_data[table_data.length -1]}
                    </div>
                </Element>
            </div>

        )
    }
}

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps =  ({
    sendSystemMessage,
    activateProject
});

export default [
    {
        path: '/plans/county/:countyPlanId',
        exact: true,
        name: 'Plans',
        auth: false,
        mainNav: false,
        breadcrumbs: [
            { name: 'Plans', path: '/plans/county/' },
            { param: 'countyPlanId', path: '/plans/county/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(PlanPage)
    }
]
