import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import { Link } from 'react-router-dom'
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get"

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    NameLabel,
    NumberLabel,
    NumberLabelBig,
    backgroundColor
} from 'pages/Public/theme/components'

var numeral = require('numeral')
class assetsPageOwnerTypeEditor extends Component {
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
                this.props.filter_type,this.props.filter_value,['flood_100','flood_500'],'sum',['count','replacement_value']]
            ).then(response =>{
                return response
        })
    }
    getOwnerData() {
        let data = [];
        let sum_replacement_value = 0;
        let sum_count = 0;
        if(this.props.buildingByOwnerTypeData !== undefined && this.props.buildingByOwnerTypeData[this.props.geoid] !== undefined){
            let graph = this.props.buildingByOwnerTypeData[this.props.geoid].ownerType;
            if(graph){
                Object.keys(graph).forEach(item =>{
                    if (graph[item].sum && this.props.filter_value.includes(item)){
                        sum_replacement_value += parseInt(graph[item].sum.replacement_value.value) || 0;
                        sum_count += parseInt(graph[item].sum.count.value) || 0;
                    }
                })
                data.push({
                    'sum_replacement_value':numeral(sum_replacement_value).format('0,0a') || 0,
                    'count': numeral(sum_count).format('0,0a') || 0
                })
            }

        }
        return data
    }

    getBuildingsByOwnerTypeByRiskZone(){
        let floodData100 = {};
        let data100 = [];
        let data500 = [];
        let floodData500 = {};
        let sum_replacement_value_100 = 0;
        let sum_replacement_value_500 = 0;
        let sum_count_100 = 0;
        let sum_count_500 = 0;
        if(this.props.buildingByOwnerTypeData[this.props.geoid] !== undefined){
            let graph = this.props.buildingByOwnerTypeData[this.props.geoid].ownerType;
            if(graph){
                this.props.filter_value.forEach(filter => {
                    if(graph[filter].flood_100 && graph[filter].flood_500){
                        sum_replacement_value_100 += parseInt(graph[filter].flood_100.sum.replacement_value.value) || 0;
                        sum_count_100 += parseInt(graph[filter].flood_100.sum.count.value)
                        sum_replacement_value_500 += parseInt(graph[filter].flood_500.sum.replacement_value.value) || 0;
                        sum_count_500 += parseInt(graph[filter].flood_500.sum.count.value) || 0
                    }

                });
                data100.push({
                    'sum_replacement_value': numeral(sum_replacement_value_100).format('0,0a') || 0,
                    'count': numeral(sum_count_100).format('0,0a') || 0
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
        let ownerData = this.getOwnerData();
        let buildingsByOwnerTypeBy100YearRiskZoneData = this.getBuildingsByOwnerTypeByRiskZone()[0];
        let buildingsByOwnerTypeBy500YearRiskZoneData = this.getBuildingsByOwnerTypeByRiskZone()[1];

        if (buildingsByOwnerTypeBy500YearRiskZoneData.length === 0){
            return (
                <div className="container">
                       
                                <h4><center>Loading ...</center></h4>
                </div>
            )
        }
        else if (buildingsByOwnerTypeBy500YearRiskZoneData.length !== 0){
            let tempTitle = 'Building Owner Types :'+ this.props.filter_value.map(d => d).join(',');
            return (
                <div>
                    {
                        ownerData.map((item,i) =>{
                            return(
                                <div>
                                    <h4>{this.props.title !== "" ? this.props.title : tempTitle}</h4>
                                    <div className={'row'} style={{padding:'10px'}}>
                                        <div className={'col-4'}>
                                            <Link className="el-tablo centered" to={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}`} style={{textAlign:'center'}}>
                                                <div>
                                                    <NameLabel>All Buildings</NameLabel>
                                                    <NumberLabelBig className="value" style={{font:'8px'}}>
                                                        ${item.sum_replacement_value}<br/>

                                                    </NumberLabelBig>
                                                    <NameLabel>{item.count} buildings</NameLabel>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className={'col-4'}>
                                            <Link className="el-tablo centered" to={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}/hazard/flood_100`} style={{textAlign:'center'}}>
                                                <div>
                                                    <NameLabel>100-year Flood Plain</NameLabel>
                                                    <NumberLabelBig className="value" style={{font:'8px'}}>
                                                        ${buildingsByOwnerTypeBy100YearRiskZoneData ? buildingsByOwnerTypeBy100YearRiskZoneData[i].sum_replacement_value:null}<br/>
                                                    </NumberLabelBig>
                                                    <NameLabel>{buildingsByOwnerTypeBy100YearRiskZoneData[i].count} buildings</NameLabel>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className={'col-4'}>
                                            <Link className="el-tablo centered" to={`/assets/list/${this.props.filter_type}/${this.props.filter_value.join('-')}/hazard/flood_500`} style={{textAlign:'center'}}>
                                                <div>
                                                    <NameLabel>500-year Flodd Plain</NameLabel>
                                                    <NumberLabelBig className="value" style={{font:'8px'}}>
                                                        ${buildingsByOwnerTypeBy500YearRiskZoneData[i] ? buildingsByOwnerTypeBy500YearRiskZoneData[i].sum_replacement_value : null}<br/>
                                                    </NumberLabelBig>
                                                    <NameLabel>{buildingsByOwnerTypeBy500YearRiskZoneData[i]? buildingsByOwnerTypeBy500YearRiskZoneData[i].count : null} buildings</NameLabel>
                                                </div>
                                            </Link>
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
        buildingByOwnerTypeData: get(state.graph,'building.byGeoid',{}),
    })
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(assetsPageOwnerTypeEditor))
