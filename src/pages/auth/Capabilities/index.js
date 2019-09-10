import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

const counties = ["36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119","36049","36069",
    "36023","36085","36029","36079","36057","36105","36073","36065","36009","36123","36107","36055","36095","36007",
    "36083","36099","36081","36037","36117","36063","36047","36015","36121","36061","36021","36013","36033","36017",
    "36067","36035","36087","36051","36025","36071","36093","36005"]

const ATTRIBUTES = [
    'capability',
    'capability_type',
    'capability_name',
    'regulatory_name',
    'adoption_date',
    'expiration_date',
    'development_update',
    'jurisdiction_utilization',
    'adopting_authority',
    'responsible_authority',
    'support_authority',
    'affiliated_agency',
    'link_url',
    'upload',
    'plan_id'
]

class CapabilitiesIndex extends React.Component {

    constructor(props){
        super(props);

        this.deleteWorksheet = this.deleteWorksheet.bind(this);
        this.actionTableData = this.actionTableData.bind(this);
    }
    componentWillMount() {
        this.fetchFalcorDeps();
    }


    fetchFalcorDeps() {
        let length = 0;
        return this.props.falcor.get(['capabilitiesLHMP',[this.props.activePlan],'length'])
            .then(response => {
                Object.keys(response.json.capabilitiesLHMP).filter(d => d !== '$__path').forEach(planId =>{
                    length = response.json.capabilitiesLHMP[planId].length;
                })
                console.log('length',length)
                return length
            }).then(length => this.props.falcor.get(
                ['capabilitiesLHMP',[this.props.activePlan],'byIndex',{from:0,to:length-1},ATTRIBUTES]))
            .then(response => {
                console.log('response',response)
                return response
            })



    }

    deleteWorksheet(e){
        console.log('in actions delete',e)
        e.persist()

        let worksheetId = e.target.id;
        console.log('worksheetId',worksheetId)
        this.props.sendSystemMessage(
            `Are you sure you with to delete this Worksheet with id "${ worksheetId }"?`,
            {
                onConfirm: () => falcorGraph.call(['actions','worksheet','remove'],[worksheetId.toString()],[],[]).then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ worksheetId }`,
                type: "danger",
                duration: 0
            }
        )

    }

    actionTableData(){
        if (this.props.actions !== undefined && this.props.actions['worksheet'] !== undefined){
            let attributes = ATTRIBUTES.slice(0,4);
            let data = []
            Object.values(this.props.actions['worksheet'].byId).forEach(action =>{
                data.push(Object.values(pick(action,...attributes)))
            });
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
                                    {data.map((item) =>{
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
                                                            onClick={this.deleteWorksheet()}>
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


    render() {
        return (
            <div>We are in Capabilities route</div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        actions: get(state.graph,'actions',{})// so componentWillReceiveProps will get called.
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/capabilities/',
        exact: true,
        name: 'Capabilities',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'capabilities', path: '/capabilities/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilitiesIndex))
    }
]
/*

 */