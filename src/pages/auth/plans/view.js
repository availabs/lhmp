import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import {setActivePlan, setActiveGeoid} from 'store/modules/user'

import get from 'lodash.get'

const ATTRIBUTES = [

    "county",
    "id",
    "fips",
    "plan_expiration",
    "plan_grant",
    "plan_status",

]

class Plans extends React.Component {

    constructor(props){
        super(props)
        this.state={
            plans_list: [],
            id:''
        }

    }
    componentDidMount(e) {
        this.fetchFalcorDeps();
    }


    onPlanClick = async event =>{
        event.preventDefault()
        let ids = event.target.getAttribute('value').split(',')
        //let geoid = event.target.getAttribute('geoid')
        this.props.setActivePlan(ids[0])
        this.props.setActiveGeoid(ids[1])
        this.props.history.push('/')
        window.location.reload(true)

    }

    fetchFalcorDeps() {
        let plan_data =[];
        return falcorGraph.get(['plans','county','length'])
            .then(length => falcorGraph.get(['plans', 'county','byIndex', {from: 0, to: length.json.plans.county.length-1 }, 'id'])
                    .then(response => {
                        const ids = [];
                        for (let i = 0; i < length.json.plans.county.length; ++i) {
                            const graph = response.json.plans.county.byIndex[i]
                            if (graph) {
                                ids.push(graph.id);
                            }
                        }

                        return ids;
                    })
            )
            .then(ids =>
                falcorGraph.get(['plans','county','byId', ids, ATTRIBUTES])
                    .then(response => {
                        Object.keys(response.json.plans.county.byId).filter(d => d!== '$__path').forEach(function(plan,i){
                            plan_data.push({
                                'id' : plan,
                                'data': Object.values(response.json.plans.county.byId[plan])
                            })
                        })
                        return plan_data
                    })
            )

    }

    render() {
        let attributes = ATTRIBUTES
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">County Plans</h6>
                    <div className="element-box">
                        <div className="table-responsive" >
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    {ATTRIBUTES.map((attribute,i)=>{
                                        return(
                                        <th>{attribute}</th>
                                        )
                                    })
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                 {Object.values(this.props.plansList).length > 0 ?
                                     Object.values(this.props.plansList)
                                         .filter(plan => this.props.authedPlans.includes(plan.id.value))
                                         .map((plan,i) =>{
                                     return(
                                     <tr>
                                         {
                                             <td>
                                             <a className=""
                                                href='#'
                                                value={plan['fips'] ? plan.id.value+','+ plan['fips'].value : plan.id.value+','+ ''}
                                                onClick={this.onPlanClick}>
                                             {plan.county.value}
                                         </a>
                                             </td>
                                                 }
                                         {

                                             ATTRIBUTES.map((attr,i) => {
                                                 if ( i > 0){
                                                     return (<td>{plan[attr].value}</td>)
                                                 }

                                             })
                                         }
                                     </tr>
                                     )
                                }) : null
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    authedPlans: state.user.authedPlans,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    plansList: get(state.graph, 'plans.county.byId',{})
});

const mapDispatchToProps = {
    sendSystemMessage,
    setActivePlan,
    setActiveGeoid
};

export default [
    {
        path: '/plans/',
        exact: true,
        name: 'Plans',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            {name: 'Plans', path: '/plans/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(Plans)
    }
]

//