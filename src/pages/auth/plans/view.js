import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import {Link, Redirect} from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import {setActivePlan, setActiveGeoid, setUserToken} from 'store/modules/user'

import get from 'lodash.get'

const ATTRIBUTES = [
    "county",
    "id",
    "fips",
    "plan_expiration",
    "plan_grant",
    "plan_status",
    "subdomain"

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

    fetchFalcorDeps() {
        let plan_data =[];
        return falcorGraph.get(['plans','county','length'])
            .then(length =>
                falcorGraph.get(['plans', 'county','byIndex', {from: 0, to: length.json.plans.county.length-1 }, 'id'])
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
                                 {
                                     Object.keys(this.props.plansList).length > 0 ?
                                     Object.values(this.props.plansList)
                                         .filter(plan => (plan.id && (this.props.authedPlans.includes(plan.id.value) || this.props.userAuthLevel === 10)))
                                         .map((plan,i) =>{
                                             let newLocation = window.location.host.split('.')
                                             newLocation.length > 1
                                                 ? newLocation[0] = plan['subdomain'].value
                                                 : newLocation = [plan['subdomain'].value, newLocation[0]]
                                             let link = 'http://' + newLocation.join('.') + '/admin';
                                     return(
                                     <tr>
                                         {
                                             <td>
                                             <a className=""
                                                href={link + '/?t=' + this.props.user.token}
                                                /*value={plan['fips']
                                                    ? plan.id.value+','+ plan['fips'].value + ','+ plan['subdomain'].value
                                                    : plan.id.value+','+ '' + ','+ plan['subdomain'].value
                                                    }*/
                                                //onClick={this.onPlanClick.bind(this)}
                                             >
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
    plansList: get(state.graph, 'plans.county.byId',{}),
    token: state.user.token || null,
    userAuthLevel: state.user.authLevel
});

const mapDispatchToProps = {
    sendSystemMessage,
    setActivePlan,
    setActiveGeoid,
    setUserToken
};

export default [
    {
        path: '/plans/',
        exact: true,
        name: 'Plans',
        auth: true,
        authLevel: 0,
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