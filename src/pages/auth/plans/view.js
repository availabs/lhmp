import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';


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

    componentWillMount(){

        this.fetchFalcorDeps().then(response =>{
            this.setState({
                plans_list : response
            })
        })

    }

    fetchFalcorDeps() {
        let plan_data =[];
        return falcorGraph.get(['plans','county','length'])
            .then(response => response.json.plans.county.length)
            .then(length => falcorGraph.get(
                ['plans', 'county','byIndex', { from: 0, to: length -1 }, 'id']
                )
                    .then(response => {
                        const ids = [];
                        for (let i = 0; i < length; ++i) {
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
                        //ids.forEach(id =>{
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

        let table_data = [];
        let attributes = ATTRIBUTES
        this.state.plans_list.map(function (each_row) {
            table_data.push(each_row.data.slice(1))
        });
        return (
            <div>
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
                                     table_data.map((data) =>{
                                     return(

                                     <tr>
                                         {
                                             data.map((d)=>{
                                                 return(<td>{d}</td>)
                                             })
                                         }
                                     <Link className="btn btn-lg btn-outline-primary"
                                           to={ `/plans/county/${data[0]}` }>
                                         View
                                     </Link>
                                     </tr>


                                     )
                                })
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
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
});

const mapDispatchToProps = {
    sendSystemMessage
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