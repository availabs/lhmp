import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'
var _ = require('lodash/core');

class BuildingByHazardRiskTable extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            hazardRisk : 'flood_zone'
        };
        this.buildingByHazardRiskTable = this.buildingByHazardRiskTable.bind(this)
    }

    componentDidUpdate(newProps){
        if(this.props !== newProps){
            return this.props.falcor.get(['building','hazard','meta','risk_zones'])
                .then(response => {
                    //console.log('res',response.json.building.hazard.meta)
                    const graph = response.json.building.hazard.meta;
                    if(graph){
                        console.log('graph',graph.risk_zones)
                        let zones = graph.risk_zones[this.state.hazardRisk].zones;
                        return zones
                    }
                })
                .then(zones =>{
                    // should be this.props.geoid but hardcoded for the sake of creating the piechart
                    this.props.falcor.get(['building','byGeoid',this.props.geoid,'hazardRisk',[this.state.hazardRisk],'zones',zones,'sum',['count','replacement_value']])
                        .then(data =>{
                            return data
                        })
                })
        }
    }

    buildingByHazardRiskTable(){
        let geoid = this.props.geoid.map((geoid) => geoid);
        //let geoid = this.props.geoid;
        let buildingByHazardRiskTableData = [];
        let total_count = 0;
        let total_replacement_value = 0;
        if(this.props.data!== undefined && this.props.data[geoid] !== undefined && this.props.data[this.props.geoid]['hazardRisk']!==undefined){

            let graph = this.props.data[geoid].hazardRisk[this.state.hazardRisk].zones
            if(graph){
                Object.keys(graph).forEach((item,i)=>{
                    buildingByHazardRiskTableData.push({
                        'zone': item,
                        'count':graph[item].sum.count.value || 0,
                        'replacement_value':graph[item].sum.replacement_value.value || 0
                    })
                })

                buildingByHazardRiskTableData.forEach((data)=>{
                    total_count += parseFloat(data.count)
                    total_replacement_value += parseFloat(data.replacement_value)
                })
            }
            //console.log('table',buildingByHazardRiskTableData)

            return(
                <div>
                    <Element>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ZONE</th>
                                    <th># BUILDING</th>
                                    <th>$ REPLACEMENT VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    buildingByHazardRiskTableData.map((data) =>{
                                        return(
                                            <tr>
                                                <td>{data.zone}</td>
                                                <td>{data.count}</td>
                                                <td>${data.replacement_value}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td><h6>Total :</h6></td>
                                    <td><h6>{total_count}</h6></td>
                                    <td><h6>${total_replacement_value}</h6></td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div>
                        </div>

                    </Element>
                </div>
            )
            }


    }

    render(){
        return (
        <div>
            {this.state.hazardRisk}
            {this.buildingByHazardRiskTable()}
        </div>
        )
    }

    static defaultProps = {

    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',ownProps)
    return {
        geoid : ownProps.geoid,
        filters : ownProps.filters,
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan,
        data : get(state.graph,'building.byGeoid')
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByHazardRiskTable))