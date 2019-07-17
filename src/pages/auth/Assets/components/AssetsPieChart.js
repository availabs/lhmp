import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {ResponsivePie} from '@nivo/pie'

const buildingOwners = [1,2,3,4,5,6,7,8,9,10,-999];
const buildingOwnersLabel = ['Federal','State','County','City','Town','Village','Mixed Government','Private','Public School District or BOCES','Road right of way','Unknown']
class AssetsPieChart extends React.Component{
    constructor(props){
        super(props)
        this.pieChart = this.pieChart.bind(this)
    }

    fetchFalcorDeps(){
        //console.log('geoid in fetch',this.props.geoid)
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'owner',buildingOwners,'sum',['count','replacement_value']])
        .then(response => {
            return response
        })
    }

    pieChart(){
        let colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494",'#1AA3CB',
            '#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C',
            '#F7C9B9', '#F4F3AF', '#C2ECF3', '#F4AD4D', '#2AF70E', '#D8AFE7', '#88DE73', '#718CD1', '#EA6A7D'];
        let geoid = this.props.geoid.map((geoid) => geoid);
        if(this.props.data!== undefined && this.props.data[geoid] !== undefined && this.props.replacement_value){
            let pieData = [];
                Object.keys(this.props.data[geoid]).forEach((item,i)=>{
                    if(this.props.data[geoid].owner !== undefined && item === 'owner'){
                        buildingOwners.map((ownerType,j) =>{
                            pieData.push({
                                'id': ownerType,
                                'label':buildingOwnersLabel[j],
                                'value': parseFloat(this.props.data[geoid].owner[ownerType].sum.replacement_value.value),
                                'color':colors[j]
                            })
                        })

                    }

                });
                const style={
                    height:200,
                };
                return(
                    <div style={style}>
                        <ResponsivePie
                            data={pieData}
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
                            padAngle={0.7}
                            cornerRadius={3}
                            colors= {pieData.map((value) => value.color)}
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
                            tooltipFormat={value => '$'+`${Math.abs(value)}`}
                        />
                    </div>
                )


        }



    }


    render(){
        return(
            <div>
            {this.pieChart()}
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsPieChart))


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
