import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import {ResponsivePie} from '@nivo/pie'

const buildingOwners = [1,2,3,4,5,6,7,8,9,10,-999];
const buildingOwnersLabel = ['Federal','State','County','City','Town','Village','Mixed Government','Private','Public School District or BOCES','Road right of way','Unknown']
class AssetsPieChart extends React.Component{
    constructor(props){
        super(props)
        this.pieChart = this.pieChart.bind(this)
    }

    fetchFalcorDeps(){


        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'owner',buildingOwners,'sum',['count','replacement_value']])
        .then(response => {
            return response
        })
    }

    pieChart(){
        if(this.props.data!== undefined && this.props.replacement_value){
            let pieDataValue = [];
            Object.keys(this.props.data[this.props.geoid].owner).forEach((owner,i)=>{
                pieDataValue.push({
                    'id': owner,
                    'label':buildingOwnersLabel[i],
                    'value': parseFloat(this.props.data[this.props.geoid].owner[owner].sum.replacement_value.value)
                })
            });
            const style={
                height:300,
            }
            return(
                <div style={style}>
                    <ResponsivePie
                        data={pieDataValue}
                        width={200}
                        height={200}
                        margin={{
                            "top": 0,
                            "right": 10,
                            "bottom": 10,
                            "left": 10
                        }}
                        pixelRatio={1.2999999523162842}
                        sortByValue={false}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors= {{scheme : 'nivo'}}
                        borderColor="inherit:darker(0.6)"
                        radialLabel="value"
                        enableRadialLabels ={false}
                        radialLabelsSkipAngle={0}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={-14}
                        radialLabelsLinkDiagonalLength={36}
                        radialLabelsLinkHorizontalLength={30}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={10}
                        enableSlicesLabels={false}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                    />
                </div>
            )
        }

    }
    

    render(){
        return(
            <h1>{this.pieChart()}</h1>
        )
    }

    static defaultProps ={
        geoid : [36001],
        count : false,
        replacement_value: false
    }
}

const mapStateToProps = (state,ownProps) => {
    //console.log('state',state)
    return {
        isAuthenticated: !!state.user.authed,
        activePlan: state.user.activePlan,
        data : get(state.graph,'building.byGeoid')
    }
};

const mapDispatchToProps =  {
    //sendSystemMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsPieChart))

/*
/*
        if(this.props.data !== undefined && this.props.count){
            let pieDataCount = [];
            Object.keys(this.props.data[this.props.geoid].owner).forEach((owner,i)=>{
                pieDataCount.push({
                    'id': owner,
                    'label':buildingOwnersLabel[i],
                    'value': parseFloat(this.props.data[this.props.geoid].owner[owner].sum.count.value)
                })
            });
            console.log('pieDataCount',pieDataCount)
            const style={
                height:200,
            }
            return(
                <div style={style}>
                    <h4>Types of Buildings</h4>
                    <ResponsivePie
                        data={pieDataCount}
                        width={200}
                        height={200}
                        margin={{
                            "top": 0,
                            "right": 10,
                            "bottom": 0,
                            "left": 10
                        }}
                        pixelRatio={1.2999999523162842}
                        sortByValue={false}
                        innerRadius={0.5}
                        padAngle={0.5}
                        cornerRadius={3}
                        colors= {{scheme : 'nivo'}}
                        borderColor="inherit:darker(0.6)"
                        radialLabel="label"
                        enableRadialLabels ={false}
                        radialLabelsSkipAngle={0}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={-14}
                        radialLabelsLinkDiagonalLength={36}
                        radialLabelsLinkHorizontalLength={30}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={10}
                        enableSlicesLabels={false}
                        slicesLabelsTextColor="#333333"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}


                    />
                </div>
            )

        }
         */
 */