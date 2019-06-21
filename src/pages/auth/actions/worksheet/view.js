import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';


const ATTRIBUTES = [
    'id',
    'project_name',
    'project_number',
    'hazard_of_concern',
    'problem_description',
    'solution_description',
    'critical_facility',
    'protection_level',
    'useful_life',
    'estimated_cost',
    'estimated_benefits',
    'priority',
    'estimated_implementation_time',
    'organization_responsible',
    'desired_implementation_time',
    'funding_source',
    'planning_mechanism',
    'alternative_action_1',
    'alternative_estimated_cost_1',
    'alternative_evaluation_1',
    'alternative_action_2',
    'alternative_estimated_cost_2',
    'alternative_evaluation_2',
    'alternative_action_3',
    'alternative_estimated_cost_3',
    'alternative_evaluation_3',
    'date_of_report',
    'progress_report',
    'updated_evaluation'
]

class ActionsIndex extends React.Component {

    constructor(props){
        super(props)

        this.state={
            action_data: [],
            id:''
        }

    }
    componentDidMount(e) {
        this.fetchFalcorDeps();
    }

    componentWillMount(){

        this.fetchFalcorDeps().then(response =>{
            this.setState({
                action_data : response
            })
        })

    }

    fetchFalcorDeps() {
        let action_data =[];
        return falcorGraph.get(['actions','worksheet','byId', [this.props.match.params.worksheetId], ATTRIBUTES])
            .then(response => {
                console.log('response',response)
                Object.keys(response.json.actions.worksheet.byId).filter(d => d!== '$__path').forEach(function(action,i){
                    action_data.push({
                        'id' : action,
                        'data': Object.values(response.json.actions.worksheet.byId[action])
                    })
                })
                return action_data
            })

    }


    render() {
        let table_data = [];
        let attributes = ATTRIBUTES.slice(1)
        this.state.action_data.map(function (each_row) {
            table_data = each_row.data.slice(2)
        });

        return (
            <div>
                <Element>
                    <h6 className="element-header">Actions Worksheet</h6>
                    <div className="element-box">
                        <div className="table-responsive" >
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attributes.map((attribute,i) =>{
                                        return (
                                            <tr>
                                                <td>{attribute}</td>
                                                <td>{table_data[i]}</td>
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
        path: '/actions/worksheet/view/:worksheetId',
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/worksheet/view/' },
            { param: 'worksheetId', path: '/actions/worksheet/view/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-dark',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(ActionsIndex)
    }
]
