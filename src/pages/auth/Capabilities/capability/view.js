import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import pick from "lodash.pick"
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';


const ATTRIBUTES = [
    //'id',
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
    //'upload',
    //'plan_id'
]

class CapabilityView extends React.Component {

    constructor(props){
        super(props)

        this.capabilitiesViewTable = this.capabilitiesViewTable.bind(this)
    }


    fetchFalcorDeps() {
        return this.props.falcor.get(['capabilitiesLHMP','byId', [this.props.match.params.capabilityId], ATTRIBUTES])
            .then(response => {
                return response
            })

    }

    capabilitiesViewTable(){
        let table_data = [];
        let data = [];
        if(this.props.capabilitiesData[this.props.match.params.capabilityId] !== undefined){
            let graph = this.props.capabilitiesData[this.props.match.params.capabilityId];
            data.push(pick(graph,...ATTRIBUTES));
            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
                    if (item[i].value && item[i].value.toString() === 'false'){
                        table_data.push({
                            attribute: i,
                            value: 'no'
                        })
                    }
                    else if(item[i].value && item[i].value.toString() === 'true'){
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
                    <h6 className="element-header">Capability</h6>
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
        return (
            <div>{this.capabilitiesViewTable()}</div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts,// so componentWillReceiveProps will get called.
    capabilitiesData: get(state.graph,'capabilitiesLHMP.byId',{})
});

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/capabilities/view/:capabilityId',
        exact: true,
        name: 'Capabilities',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Capabilities', path: '/capabilities/' },
            { param: 'capabilityId', path: '/capabilities/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilityView))
    }
]

