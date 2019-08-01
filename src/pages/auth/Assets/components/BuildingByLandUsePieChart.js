import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { ResponsiveSunburst } from '@nivo/sunburst'
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'


class BuildingByLandUsePieChart extends React.Component{
    constructor(props){
        super(props);
        this.buildingByLandUsePieChart = this.buildingByLandUsePieChart.bind(this)

    }

    fetchFalcorDeps(){
        if(this.props.geoid !== undefined){
            let propTypes = []
            BuildingByLandUseConfig.map(item => {
                propTypes.push(item.value)
            })
            return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',propTypes,'sum',['count','replacement_value']])
                .then(response =>{
                    return response

                })
        }

    }

    buildingByLandUsePieChart () {
        if (this.props.data !== undefined && this.props.data[this.props.geoid]!== undefined && this.props.data[this.props.geoid]['propType'] !== undefined) {
            let buildingPieChartData = {
                "name":'',
                "color":'',
                "children": []
            }
            let buildingPropTypeData = this.props.data[this.props.geoid]['propType'];
            Object.keys(buildingPropTypeData).forEach((propType,i) => {
                if(propType % 100 === 0){
                    buildingPieChartData["name"] = "PropType"
                    buildingPieChartData["color"] = "hsl(140, 70%, 50%)"
                    buildingPieChartData["children"].push({
                        "name":propType,
                        "color": "hsl(116, 70%, 50%)",
                        "children" : []
                    })
                }
                if(propType % 10=== 0 &&!(propType % 100 === 0) || propType === '105'){
                    buildingPieChartData.children.map(f => {
                        if (f.name === propType.split('')[0] + '00'){
                            if(propType === '105'){
                                f.children.push({
                                    "name": propType,
                                    "color":"hsl(116, 70%, 50%)",
                                    "loc": buildingPropTypeData[propType].sum.replacement_value.value || 0
                                })
                            }
                            else{
                                f.children.push({
                                    "name": propType,
                                    "color": "hsl(116, 70%, 50%)",
                                    "children": []
                                })
                            }

                        }else {
                            return f
                        }
                    })
                }
                if(!(propType % 100 === 0) && !(propType % 10 === 0)){
                    buildingPieChartData.children.map(a =>{
                        a.children.map( b => {
                            if(b.name === propType.slice(0,2)+'0'){
                                b.children.push({
                                    "name":propType,
                                    "color":"hsl(116, 70%, 50%)",
                                    "loc": buildingPropTypeData[propType].sum.replacement_value.value || 0
                                })
                            }
                            else{
                                return b
                            }
                        })
                    })
                }

            });
            const style = {
                height: 200,
            };
            return (
                <div style={style}>
                    <ResponsiveSunburst
                        data={buildingPieChartData}
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
        return (
            <div>{this.buildingByLandUsePieChart()}</div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByLandUsePieChart))