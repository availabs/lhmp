import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {ResponsiveSunburst} from '@nivo/sunburst'

class BuildingByHazardRiskPieChart extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            hazardRisk : 'flood_zone'
        }
        this.buildingByHazardRiskPieChart = this.buildingByHazardRiskPieChart.bind(this)
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['building','hazard','meta'])
            .then(response => {
                const graph = response.json.building.hazard.meta;
                if(graph){
                    let zones = graph[this.state.hazardRisk].zones;
                    return zones
                }
            })
            .then(zones =>{
                // should be this.props.geoid but hardcoded for the sake of creating the piechart
                this.props.falcor.get(['building','byGeoid',this.props.geoid,'hazardRisk',[this.state.hazardRisk],'zones',zones,'sum',['count','replacement_value']])
                    .then(response =>{
                        return response
                    })
            })
    }

    buildingByHazardRiskPieChart(){
        let colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494",'#1AA3CB',
            '#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C',
            '#F7C9B9', '#F4F3AF', '#C2ECF3', '#F4AD4D', '#2AF70E', '#D8AFE7', '#88DE73', '#718CD1', '#EA6A7D'];
        let geoid = this.props.geoid.map((geoid) => geoid);
        //let geoid = this.props.geoid;
        if(this.props.data!== undefined && this.props.data[geoid] !== undefined && this.props.data[this.props.geoid]['hazardRisk']!==undefined){
            console.log('this.props',this.props.data);
            let buildingHazardRiskPieChartData = {
                "name":'HazardRisk',
                "color":"hsl(116, 70%, 50%)",
                "children": [
                    {
                        "name":this.state.hazardRisk,
                        "color":"hsl(116, 70%, 50%)",
                        "children":[]
                    }
                ]
            };
            let graph = this.props.data[this.props.geoid]['hazardRisk']
            Object.keys(graph).forEach((risk) =>{
                let zoneNames = Object.keys(graph[risk].zones)
                zoneNames.forEach((zone,i) =>{
                    buildingHazardRiskPieChartData.children.forEach((child)=>{
                        if(risk === child.name ){
                            child.children.push({
                                "name":zone,
                                "color":colors[i],
                                "loc": graph[risk].zones[zone].sum.replacement_value.value || 0
                            })
                        }
                    })
                })

            });
            const style={
                height:200,
            };
            return(
                <div style={style}>
                    <ResponsiveSunburst
                        data={buildingHazardRiskPieChartData}
                        margin={{top: 40, right: 20, bottom: 20, left: 20}}
                        identity="name"
                        value="loc"
                        cornerRadius={2}
                        borderWidth={1}
                        borderColor="white"
                        colors={{scheme: 'nivo'}}
                        childColor={{from: 'color'}}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        isInteractive={false}
                        tooltipFormat={value => `${Math.abs(value)}`}
                    />
                </div>
            )
            }

    }

    render(){
        return(
            <div>
                {this.buildingByHazardRiskPieChart()}
            </div>
        )
    }

    static defaultProps ={
        geoid : [36001],
        count : false,
        replacement_value: false
    }

}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',state.graph)
    return {
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan,
        data : get(state.graph,'building.byGeoid')
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByHazardRiskPieChart))


