import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';

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
    'cousub'
]

class ActionsIndex extends React.Component {

    constructor(props){
        super(props)

        this.state={
            action_data: [],
        }

        this.deleteWorksheet = this.deleteWorksheet.bind(this)
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
        return falcorGraph.get(['actions','worksheet','length'])
            .then(response => response.json.actions.worksheet.length)
            .then(length => falcorGraph.get(
                ['actions', 'worksheet','byIndex', { from: 0, to: length -1 }, 'id']
                )
                    .then(response => {
                        const ids = [];
                        for (let i = 0; i < length; ++i) {
                            const graph = response.json.actions.worksheet.byIndex[i]
                            if (graph) {
                                ids.push(graph.id);
                            }
                        }
                        return ids;
                    })
            )
            .then(ids =>
                falcorGraph.get(['actions','worksheet','byId', ids, ATTRIBUTES])
                    .then(response => {
                        //ids.forEach(id =>{
                            Object.keys(response.json.actions.worksheet.byId).filter(d => d!== '$__path').forEach(function(action,i){
                                action_data.push({
                                    'id' : action,
                                    'data': Object.values(response.json.actions.worksheet.byId[action])
                                })
                            })
                        return action_data
                    })
            )


    }

    deleteWorksheet(e){
        e.persist()
        let worksheetId = e.target.id
        this.props.sendSystemMessage(
            `Are you sure you with to delete this Worksheet with id "${ worksheetId }"?`,
        {
            onConfirm: () => falcorGraph.call(['actions','worksheet','remove'],[worksheetId.toString()],[],[]).then(() => this.fetchFalcorDeps().then(response => {
                this.setState({
                    action_data:response
                })
            })),
            id: `delete-content-${ worksheetId }`,
            type: "danger",
            duration: 0
        }
        )

    }

    
    render() {
        let table_data = [];
        let attributes = ATTRIBUTES.slice(0,4)
        this.state.action_data.map(function (each_row) {
            table_data.push(each_row.data.slice(1,5))
        })

        return (
            <div className='container'>
            <Element>
                <h4 className="element-header">Actions
                    <span style={{float:'right'}}>
                        <Link 
                            className="btn btn-sm btn-primary"
                            to={ `/actions/worksheet/new` } >
                                Create Action Worksheet
                        </Link>
                        <button 
                            disabled
                            className="btn btn-sm btn-disabled"
                            >
                                Create Action Planner
                        </button>
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
                        <table className="table table lightBorder">
                            <thead>
                            <tr>
                                {attributes.map(function(action,index){
                                    return (
                                        <th>{action}</th>
                                    )
                                })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {table_data.map((data) =>{
                                return (
                                    <tr>
                                        {data.map((d) => {
                                            return (
                                                <td>{d}</td>
                                            )
                                        })
                                        }
                                        <td>
                                                <Link className="btn btn-sm btn-outline-primary"
                                                      to={ `/actions/worksheet/edit/${data[0]}` } >
                                                    Edit
                                                </Link>
                                        </td>
                                        <td>
                                                <Link className="btn btn-sm btn-outline-primary"
                                                      to={ `/actions/worksheet/view/${data[0]}` }>
                                                    View
                                                </Link>
                                        </td>
                                        <td>
                                                <button id= {data[0]} className="btn btn-sm btn-outline-danger"
                                                        onClick={this.deleteWorksheet}>
                                                    Delete
                                                </button>
                                        </td>
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
        component: connect(mapStateToProps,mapDispatchToProps)(ActionsIndex)
    }
]
