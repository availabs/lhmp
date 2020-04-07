import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

const ATTRIBUTES = [
    'id',
    'capability_category',
    'capability_name',
    'capability_type',
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
];

class CapabilitiesIndex extends React.Component {

    constructor(props){
        super(props);

        this.deleteCapability = this.deleteCapability.bind(this);
        this.capabilitiesTableData = this.capabilitiesTableData.bind(this);
    }


    fetchFalcorDeps() {
        let length = 0;
        return this.props.falcor.get(['capabilitiesLHMP',[this.props.activePlan],'length'])
            .then(response => {
                //console.log('first response',response)
                Object.keys(response.json.capabilitiesLHMP).filter(d => d !== '$__path').forEach(planId =>{
                    length = response.json.capabilitiesLHMP[planId].length;
                });
                //console.log('length',length)
                return length
            }).then(length => this.props.falcor.get(
                ['capabilitiesLHMP',[this.props.activePlan],'byIndex',{from:0,to:length-1},ATTRIBUTES]))
            .then(response => {
                //console.log('response',response)
                return response
            })



    }

    deleteCapability(e){
        e.persist();
        let capabilityId = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this Capability with id "${ capabilityId }"?`,
            {
                onConfirm: () => this.props.falcor.call(['capabilitiesLHMP','remove'],[capabilityId])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ capabilityId }`,
                type: "danger",
                duration: 0
            }
        )


    }

    capabilitiesTableData(){
        let attributes = ATTRIBUTES.slice(0,3);
        let data = [];
        Object.values(this.props.capabilities).forEach(capability =>{
            data.push(Object.values(pick(capability,...attributes)))
        });
        //console.log('data',data)
        return data

    }

    render() {
        let attributes = ATTRIBUTES.slice(0,3);
        let data = this.capabilitiesTableData()
        return(
            <div className='container'>
                <Element>
                    <h4 className="element-header">Capabilities
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/capabilities/new` } >
                                Create New Capability
                        </Link>
                        <button
                            disabled
                            className="btn btn-sm btn-disabled"
                        >
                                Create Capability Planner
                        </button>
                        <button
                            disabled
                            className="btn btn-sm btn-disabled"
                        >
                                Create HMGP Capability
                        </button>
                    </span>
                    </h4>
                    <div className="element-box">
                        <div className="table-responsive" >
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    {attributes.map((capability) =>{
                                        return (
                                            <th>{capability}</th>
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
                                                          to={ `/capabilities/edit/${item[0].value}` } >
                                                        Edit
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link className="btn btn-sm btn-outline-primary"
                                                          to={ `/capabilities/view/${item[0].value}` }>
                                                        View
                                                    </Link>
                                                </td>
                                                <td>
                                                    <button id= {item[0].value} className="btn btn-sm btn-outline-danger"
                                                            onClick={this.deleteCapability}>
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
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        capabilities: get(state.graph,'capabilitiesLHMP.byId',{})// so componentWillReceiveProps will get called.
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/capabilitiesOld/',
        exact: true,
        name: 'Capabilities',
        auth: true,
        mainNav: true,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'capabilities', path: '/capabilitiesOld/' }
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
