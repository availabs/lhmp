import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js';
import ProjectConfig from 'pages/auth/actions/actions_project_forms/config.js'
import WorksheetConfig from 'pages/auth/actions/actions_worksheet_forms/config.js'
import {sendSystemMessage} from 'store/modules/messages';

class ActionsFormsIndex extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <AvlFormsListTable
            json = {ProjectConfig}
            />
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
        path: '/actions/',
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
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsFormsIndex))
    }
]
/*
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
 */