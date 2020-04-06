import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"
import {ATTRIBUTES_PROJECT} from './project/index'
const counties = ["36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119","36049","36069",
    "36023","36085","36029","36079","36057","36105","36073","36065","36009","36123","36107","36055","36095","36007",
    "36083","36099","36081","36037","36117","36063","36047","36015","36121","36061","36021","36013","36033","36017",
    "36067","36035","36087","36051","36025","36071","36093","36005"]

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
    'updated_evaluation',
    'county',
    'cousub',
]
class ActionsIndex extends React.Component {

    constructor(props){
        super(props);

        this.deleteWorksheet = this.deleteWorksheet.bind(this);
        this.deleteproject = this.deleteproject.bind(this);
        this.actionTableData = this.actionTableData.bind(this);
    }

    fetchFalcorDeps() {
        let length = 0;
        return this.props.falcor.get(['actions',[this.props.activePlan],'worksheet','length'])
            .then(response => {
                Object.keys(response.json.actions).filter(d => d !== '$__path').forEach(planId =>{
                     length = response.json.actions[planId].worksheet.length;
                })
                return length
            }).then(length => this.props.falcor.get(
                ['actions',[this.props.activePlan],'worksheet','byIndex',{from:0,to:length-1},ATTRIBUTES]))
            .then(response => {
                return response
            }).then( d => {
                return this.props.falcor.get(['actions', [this.props.activePlan], 'project', 'length'])
                    .then(response => {
                        Object.keys(response.json.actions).filter(d => d !== '$__path').forEach(planId => {
                            length = response.json.actions[planId].project.length;
                        });
                        return length
                    }).then(length => this.props.falcor.get(
                        ['actions', [this.props.activePlan], 'project', 'byIndex', {from: 0, to: length - 1}, ATTRIBUTES_PROJECT]))
                    .then(response => {
                        return response
                    })
            })



    }

    deleteWorksheet(e){
        e.persist()
        let worksheetId = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this Worksheet id "${ worksheetId }"?`,
        {
            onConfirm: () => falcorGraph.call(['actions','worksheet','remove'],[worksheetId])
                .then(() => this.fetchFalcorDeps()),
            id: `delete-content-${ worksheetId }`,
            type: "danger",
            duration: 0
        }
        )
    }
    deleteproject(e) {
        e.persist();
        let projectId = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this project id "${projectId}"?`,
            {
                onConfirm: () => falcorGraph.call(['actions', 'project', 'remove'], [projectId])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${projectId}`,
                type: "danger",
                duration: 0
            }
        )

    }
    renderWorksheet(){
        let attributes = ATTRIBUTES.slice(0,4);
        let data = [];
        Object.values(this.props.actions)
            .forEach(action =>{
                data.push(Object.values(pick(action,...attributes)))
            });
        return(
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributes.map(function(action){
                        return (
                            <th>{action}</th>
                        )
                    })
                    }
                </tr>
                </thead>
                <tbody>
                {data.map((item,i) =>{
                    if(item.length !== 0){
                        return (
                            <tr>
                                {
                                    item.map((d) =>{

                                        return(
                                            <td>{d.value}</td>
                                        )
                                    })
                                }
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary"
                                          to={ `/actions/worksheet/edit/${item[0].value}` } >
                                        Edit
                                    </Link>
                                </td>
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary"
                                          to={ `/actions/worksheet/view/${item[0].value}` }>
                                        View
                                    </Link>
                                </td>
                                <td>
                                    <button id= {item[0].value} className="btn btn-sm btn-outline-danger"
                                            onClick={this.deleteWorksheet}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    }

                })
                }
                </tbody>
            </table>
        )
    }

    renderProject(){
        let attributesProject = ATTRIBUTES_PROJECT.slice(0,4);
        let data = [];
        console.log('actions project',this.props.actionsProject)
        Object.values(this.props.actionsProject)
            .forEach(action =>{
                data.push(Object.values(pick(action,...attributesProject)))
            });
        return (
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributesProject.map(function (action) {
                        return (
                            <th>{action}</th>
                        )
                    })
                    }
                </tr>
                </thead>
                <tbody>
                {data.map((item, i) => {
                    if (item.length !== 0) {
                        return (
                            <tr>
                                {
                                    item.map((d) => {

                                        return (
                                            <td>{d.value}</td>
                                        )
                                    })
                                }
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary"
                                          to={`/actions/project/edit/${item[0].value}`}>
                                        Edit
                                    </Link>
                                </td>
                                <td>
                                    <Link className="btn btn-sm btn-outline-primary"
                                          to={`/actions/project/view/${item[0].value}`}>
                                        View
                                    </Link>
                                </td>
                                <td>
                                    <button id={item[0].value} className="btn btn-sm btn-outline-danger"
                                            onClick={this.deleteproject}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    }

                })
                }
                </tbody>
            </table>
        )
    }
    actionTableData(){
            return(
                <div className='container'>
                    <Element>
                        <h4 className="element-header">Actions
                            <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/actions/worksheet/new` } >
                                Create Action Worksheet
                        </Link>
                        <Link
                            to= {'/actions/project/new'}
                            className="btn btn-sm btn-primary"
                        >
                                Create Action Planner
                        </Link>
                        <button
                            disabled
                            className="btn btn-sm btn-disabled"
                        >
                                Create HMGP Action
                        </button>
                    </span>
                        </h4>
                        <div className="element-box">
                            <div className="table-responsive" >
                                {this.renderWorksheet()}
                                {this.renderProject()}
                            </div>
                        </div>
                    </Element>
                </div>
            )
        }

    render() {
        return (
            <div>{this.actionTableData()}</div>
        )
    }
}

const mapStateToProps = state => (
    {
    activePlan : state.user.activePlan,
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts,
    actions: get(state.graph,'actions.worksheet.byId',{}),// so componentWillReceiveProps will get called.
    actionsProject: get(state.graph, 'actions.project.byId', {})// so componentWillReceiveProps will get called.

    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/actionsOld/',
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsIndex))
    }
]
/*

 */