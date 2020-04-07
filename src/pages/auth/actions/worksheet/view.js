import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick";


const ATTRIBUTES = [
    //'id',
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

        this.actionViewData = this.actionViewData.bind(this)

    }

    fetchFalcorDeps() {

        return falcorGraph.get(['actions','worksheet','byId', [this.props.match.params.worksheetId], ATTRIBUTES])
            .then(response => {
                return response
            })
    }

    actionViewData(){
        let table_data = [];
        let data = [];
        if(this.props.actionViewData[this.props.match.params.worksheetId] !== undefined){
            let graph = this.props.actionViewData[this.props.match.params.worksheetId];
            data.push(pick(graph,...ATTRIBUTES));
            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
                    if (item[i].value.toString() === 'false'){
                        table_data.push({
                            attribute: i,
                            value: 'no'
                        })
                    }
                    else if(item[i].value.toString() === 'true'){
                        table_data.push({
                            attribute : i,
                            value : 'yes'
                        })
                    }else{
                        table_data.push({
                            attribute : i,
                            value: item[i].value
                        })
                    }

                })
            })
        }
        return (
            <div className='container'>
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
                                {
                                    table_data.map(data =>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{data.value}</td>
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

    render() {
        return(
            <div>
                {this.actionViewData()}
            </div>

        )

    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    actionViewData : get(state.graph,'actions.worksheet.byId',{})
});

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/actionsOld/worksheet/view/:worksheetId',
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actionsOld/worksheet/view/' },
            { param: 'worksheetId', path: '/actionsOld/worksheet/view/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(ActionsIndex)
    }
]