import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get"
var numeral = require('numeral')

class assetsPageCriticalTypeEditor extends Component {
    constructor(props) {
        super(props);

        this.renderTableBoxes= this.renderTableBoxes.bind(this)
    }

    componentDidUpdate(prevProps,oldState){
        if(this.props.geoid !== prevProps.geoid){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,
                this.props.filter_type,this.props.filter_value,'sum',['count','replacement_value']],
            ['building','byGeoid',this.props.geoid,
                this.props.filter_type,this.props.filter_value,['flood_100'],'sum',['count','replacement_value']])
        .then(response =>{
            this.props.falcor.get(['building','byGeoid',this.props.geoid,
                this.props.filter_type,this.props.filter_value,['flood_500'],'sum',['count','replacement_value']])
                .then(response =>{
                    return response
                })
        })
         
    }
    getCriticalData() {
        let data = [];
        let sum_replacement_value = 0;
        let sum_count = 0;
        if(this.props.buildingByCriticalTypeData[this.props.geoid] !== undefined){
            let graph = this.props.buildingByCriticalTypeData[this.props.geoid].critical;
            Object.keys(graph).forEach(item =>{
                if (this.props.filter_value.includes(item)){
                    sum_replacement_value += parseInt(graph[item].sum.replacement_value.value) || 0;
                    sum_count += parseInt(graph[item].sum.count.value) || 0;
                }
            })
            data.push({
                'sum_replacement_value':numeral(sum_replacement_value).format('0,0a') || 0,
                'count': numeral(sum_count).format('0,0a') || 0
            })
        }
        return data
    }
    
    getBuildingsByCriticalTypeByRiskZone(){
        let floodData100 = {};
        let data100 = [];
        let data500 = [];
        let floodData500 = {};
        let sum_replacement_value_100 = 0;
        let sum_replacement_value_500 = 0;
        let sum_count_100 = 0;
        let sum_count_500 = 0;
        if(this.props.buildingByCriticalTypeData[this.props.geoid] !== undefined){
            let graph = this.props.buildingByCriticalTypeData[this.props.geoid].critical;
            this.props.filter_value.forEach(value =>{
                if(graph[value].flood_100 !== undefined){
                    floodData100[value] = graph[value].flood_100;
                }
                if(graph[value].flood_500 !== undefined){
                    floodData500[value] = graph[value].flood_500
                }
            })
            Object.keys(floodData100).forEach(item => {
                sum_replacement_value_100 += parseInt(floodData100[item].sum.replacement_value.value) || 0;
                sum_count_100 += parseInt(floodData100[item].sum.count.value)
            });
            data100.push({
                'sum_replacement_value': numeral(sum_replacement_value_100).format('0,0a') || 0,
                'count': numeral(sum_count_100).format('0,0a') || 0
            });
            if(Object.keys(floodData500).length !== 0){
                Object.keys(floodData500).forEach(item =>{
                    sum_replacement_value_500 += parseInt(floodData500[item].sum.replacement_value.value) || 0;
                    sum_count_500 += parseInt(floodData500[item].sum.count.value) || 0
                });
                data500.push({
                    'sum_replacement_value':numeral(sum_replacement_value_500).format('0,0a') || 0,
                    'count': numeral(sum_count_500).format('0,0a') || 0
                })
            }
        }
        return [data100,data500]
    }
     
    renderTableBoxes() {
        let criticalData = this.getCriticalData();
        let tempTitle = 'Critical Building Types :'+ this.props.filter_value.map(d => d).join(',');
        let buildingsByCriticalTypeBy100YearRiskZoneData = this.getBuildingsByCriticalTypeByRiskZone()[0];
        let buildingsByCriticalTypeBy500YearRiskZoneData = this.getBuildingsByCriticalTypeByRiskZone()[1];
        if (buildingsByCriticalTypeBy500YearRiskZoneData.length === 0){
            return (
                <div className="container">
                    <div className="element-wrapper">
                        <div className="element-box">
                            <h4><center>Loading ...</center></h4>
                        </div>
                    </div>
                </div>
            )
        }
        else if (buildingsByCriticalTypeBy500YearRiskZoneData.length !== 0){
            return (
                <div>
                    {
                        criticalData.map((item,i) =>{
                            return(
                                <div>
                                    <h4>{this.props.title !== "" ? this.props.title : tempTitle}</h4>
                                    <div className={'row'} style={{padding:'10px'}}>
                                        <div className={'col-4'}>
                                            <a className="element-box el-tablo" href={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}`} style={{textAlign:'center'}}>
                                                <div>
                                                    <div className="label">Replacement Value</div>
                                                    <div className="value" style={{font:'8px'}}>
                                                        ${item.sum_replacement_value}<br/>

                                                    </div>
                                                    <div className="label">{item.count} buildings</div>
                                                </div>
                                            </a>
                                        </div>

                                        <div className={'col-4'}>
                                            <a className="element-box el-tablo" href={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}/hazard/flood_100`} style={{textAlign:'center'}}>
                                                <div>
                                                    <div className="label">100-year flood zone Replacement Value</div>
                                                    <div className="value" style={{font:'8px'}}>
                                                        ${buildingsByCriticalTypeBy100YearRiskZoneData ? buildingsByCriticalTypeBy100YearRiskZoneData[i].sum_replacement_value:null}<br/>
                                                    </div>
                                                    <div className="label">{buildingsByCriticalTypeBy100YearRiskZoneData[i].count} buildings</div>
                                                </div>
                                            </a>
                                        </div>

                                        <div className={'col-4'}>
                                            <a className="element-box el-tablo" href={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}/hazard/flood_500`} style={{textAlign:'center'}}>
                                                <div>
                                                    <div className="label">500-year flood zone Replacement Value</div>
                                                    <div className="value" style={{font:'8px'}}>
                                                        ${buildingsByCriticalTypeBy500YearRiskZoneData[i] ? buildingsByCriticalTypeBy500YearRiskZoneData[i].sum_replacement_value : null}<br/>
                                                    </div>
                                                    <div className="label">{buildingsByCriticalTypeBy500YearRiskZoneData[i]? buildingsByCriticalTypeBy500YearRiskZoneData[i].count : null} buildings</div>
                                                </div>
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderTableBoxes()}
            </div>

        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return ({
        activePlan: state.user.activePlan,
        geoid: ownProps.geoid,
        prop_class: ownProps.prop_class,
        filter_type : ownProps.filter_type,
        filter_value : ownProps.filter_value,
        title : ownProps.title,
        buildingByCriticalTypeData: get(state.graph,'building.byGeoid',{}),
    })
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(assetsPageCriticalTypeEditor))
