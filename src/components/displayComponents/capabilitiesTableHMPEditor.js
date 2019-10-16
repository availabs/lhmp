import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import pick from "lodash.pick";
import {Link} from "react-router-dom";
import get from "lodash.get";

const ATTRIBUTES = [
    'id',
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
    'plan_id',
    'cousub',
    'county'
];
class capabilitiesTableHMPEditor extends Component {
    constructor(props) {
        super(props);
        this.state={
        }
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

    capabilitiesTableData(){
        let attributes = ATTRIBUTES.slice(0,3);
        let data = [];
        Object.values(this.props.capabilities).forEach(capability =>{
            if (capability.capability.value === "Hazard mitigation plan" &&
                (capability.cousub && capability.cousub.value && capability.cousub.value === this.props.activeCousubid ||
                    capability.county && capability.county.value && capability.county.value === this.props.activeCousubid)
            ){
                data.push(Object.values(pick(capability,...attributes)))
            }
        });
        return data

    }

    renderMainTable(){
        let attributes = ATTRIBUTES.slice(0,3);
        let data = this.capabilitiesTableData()

        return data.length > 0 ? (
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
                            </tr>
                        )
                    }

                })
                }
                </tbody>
            </table>
        ): <div> No Capabilities found.</div>

    }
    render() {
        return(
            <div className='container'>
                <Element>
                    <h6 className="element-header">Capabilities
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/capabilities/` } >
                                Edit Capabilities
                        </Link>
                    </span>
                    </h6>
                    <div className="element-box" style={{'overflow': 'scroll', 'maxHeight': '80vh'}}>
                        <div className="table-responsive" >
                            {this.renderMainTable()}
                        </div>
                    </div>
                </Element>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return ({
        activePlan : state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        capabilities: get(state.graph,'capabilitiesLHMP.byId',{}),// so componentWillReceiveProps will get called.
        activeCousubid: state.user.activeCousubid,
        activeGeoid: state.user.activeGeoid
    })
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(capabilitiesTableHMPEditor))
