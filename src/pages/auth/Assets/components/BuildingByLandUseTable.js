import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import {falcorChunkerNice} from "store/falcorGraph"
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'
var _ = require('lodash/core');
var numeral = require('numeral');

class BuildingByLandUseTable extends React.Component{
    constructor(props){
        super(props)
        this.buildingByLandUseTable = this.buildingByLandUseTable.bind(this)
    }

    fetchFalcorDeps(){
        let propTypes = [];
        BuildingByLandUseConfig.forEach(item => {
            propTypes.push(item.value)
        })
        return falcorChunkerNice(
            ['building','byGeoid',this.props.geoid,'propType',propTypes,'sum',['count','replacement_value']],
            ['building','byGeoid',this.props.geoid,'propType',propTypes,['flood_100', 'flood_500'],'sum',['count','replacement_value']]
        )

        }

    componentDidUpdate(ownProps){
        let propTypes = [];
        if(this.props !== ownProps){
            BuildingByLandUseConfig.forEach(item => {
                propTypes.push(item.value)
            });
        this.fetchFalcorDeps()
        }

    }

    buildingByLandUseTable(){
        let buildingLandUseData = {};
        let buildingLandUseNames = [];
        if(this.props.data !== undefined && this.props.geoid !== undefined && this.props.data[this.props.geoid] && this.props.data[this.props.geoid].propType !== undefined){
            if(this.props.filters.length === 0){
                let data = this.props.data[this.props.geoid].propType
                let categories = Object.keys(data).filter(item => parseInt(item) % 100 === 0);

                Object.keys(data).forEach(item =>{
                    categories.map((category,i)=>{
                        if(category.slice(0,1) === item.slice(0,1)){
                            if (buildingLandUseData[category]){
                                buildingLandUseData[category].count += parseFloat(data[item].sum.count.value) || 0;
                                buildingLandUseData[category].replacement_value += parseFloat(data[item].sum.replacement_value.value) || 0;

                                buildingLandUseData[category].flood_100_count += parseFloat(data[item].flood_100.sum.count.value) || 0;
                                buildingLandUseData[category].flood_100_replacement_value += parseFloat(data[item].flood_100.sum.replacement_value.value) || 0;

                                buildingLandUseData[category].flood_500_count += parseFloat(data[item].flood_500.sum.count.value) || 0;
                                buildingLandUseData[category].flood_500_replacement_value += parseFloat(data[item].flood_500.sum.replacement_value.value) || 0;
                            }else{
                                buildingLandUseData[category] = {
                                    count: parseFloat(data[item].sum.count.value) || 0,
                                    replacement_value: parseFloat(data[item].sum.replacement_value.value) || 0,
                                    flood_100_count: parseFloat(data[item].flood_100.sum.count.value) || 0,
                                    flood_100_replacement_value: parseFloat(data[item].flood_100.sum.replacement_value.value) || 0,
                                    flood_500_count: parseFloat(data[item].flood_500.sum.count.value) || 0,
                                    flood_500_replacement_value: parseFloat(data[item].flood_500.sum.replacement_value.value) || 0,
                                };
                            }
                        }

                    })

                });
            }
            else{
                let data = this.props.data[this.props.geoid].propType;
                this.props.filters.forEach(propFilter =>{
                    if(parseInt(propFilter) % 100 === 0) {
                        let total_filter = {
                            name: "Total",
                            count: 0,
                            replacement_value: 0,
                            flood_100_count:  0,
                            flood_100_replacement_value:  0,
                            flood_500_count:  0,
                            flood_500_replacement_value:  0,
                        };
                        Object.keys(data).forEach((item, i) => {
                            if(propFilter.slice(0,1) === item.slice(0,1)){

                                total_filter.count += parseFloat(data[item].sum.count.value) || 0;
                                total_filter.replacement_value += parseFloat(data[item].sum.replacement_value.value) || 0;

                                total_filter.flood_100_count += parseFloat(data[item].flood_100.sum.count.value) || 0;
                                total_filter.flood_100_replacement_value += parseFloat(data[item].flood_100.sum.replacement_value.value) || 0;

                                total_filter.flood_500_count += parseFloat(data[item].flood_500.sum.count.value) || 0;
                                total_filter.flood_500_replacement_value += parseFloat(data[item].flood_500.sum.replacement_value.value) || 0;
                                
                                if (buildingLandUseData[item]){
                                    buildingLandUseData[item].count += parseFloat(data[item].sum.count.value) || 0;
                                    buildingLandUseData[item].replacement_value += parseFloat(data[item].sum.replacement_value.value) || 0;

                                    buildingLandUseData[item].flood_100_count += parseFloat(data[item].flood_100.sum.count.value) || 0;
                                    buildingLandUseData[item].flood_100_replacement_value += parseFloat(data[item].flood_100.sum.replacement_value.value) || 0;

                                    buildingLandUseData[item].flood_500_count += parseFloat(data[item].flood_500.sum.count.value) || 0;
                                    buildingLandUseData[item].flood_500_replacement_value += parseFloat(data[item].flood_500.sum.replacement_value.value) || 0;
                                }else{
                                    buildingLandUseData[item] = {
                                        count: parseFloat(data[item].sum.count.value) || 0,
                                        replacement_value: parseFloat(data[item].sum.replacement_value.value) || 0,
                                        flood_100_count: parseFloat(data[item].flood_100.sum.count.value) || 0,
                                        flood_100_replacement_value: parseFloat(data[item].flood_100.sum.replacement_value.value) || 0,
                                        flood_500_count: parseFloat(data[item].flood_500.sum.count.value) || 0,
                                        flood_500_replacement_value: parseFloat(data[item].flood_500.sum.replacement_value.value) || 0,
                                    };
                                }
                            }

                        })
                        buildingLandUseData['total_filter'] = total_filter
                    }

                });

            }
            let landUseSubCategoryMapping = {}
            BuildingByLandUseConfig.map((config)=>{
                landUseSubCategoryMapping[config.value.slice(0,1) + '00'] ?
                    landUseSubCategoryMapping[config.value.slice(0,1) + '00'].push(config.value) :
                    landUseSubCategoryMapping[config.value.slice(0,1) + '00'] = [config.value];
                Object.keys(buildingLandUseData).forEach((data)=>{
                    if(data === config.value){
                        buildingLandUseNames.push(config)
                    }
                })
            })
            return (
                <div>
                    <Element>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>LAND USE TYPE</th>
                                    <th># LAND USE TYPE</th>
                                    <th>$ REPLACEMENT VALUE</th>
                                    <th>100 YEAR DFERM # LAND USE TYPE</th>
                                    <th>100 YEAR DFERM $ REPLACEMENT VALUE</th>
                                    <th>500 YEAR DFERM # LAND USE TYPE</th>
                                    <th>500 YEAR DFERM $ REPLACEMENT VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.filters.length !== 0 ? 
                                <tr>
                                    <td onClick={() => {this.props.updateFilter([])}}>
                                        <a href={'#'}>{ buildingLandUseData['total_filter'].name}</a>
                                    </td>
                                    <td>{buildingLandUseData['total_filter'].count || 0}</td>
                                    <td>${numeral(buildingLandUseData['total_filter'].replacement_value).format('0,0.a') || 0}</td>

                                    <td>{buildingLandUseData['total_filter'].flood_100_count || 0}</td>
                                    <td>${numeral(buildingLandUseData['total_filter'].flood_100_replacement_value).format('0,0.a') || 0}</td>

                                    <td>{buildingLandUseData['total_filter'].flood_500_count || 0}</td>
                                    <td>${numeral(buildingLandUseData['total_filter'].flood_500_replacement_value).format('0,0.a') || 0}</td>
                                </tr> : null
                                }
                                {
                                    buildingLandUseData !== undefined ?
                                        Object.keys(buildingLandUseData)
                                            .filter(f => f !== 'total_filter')
                                            .map((item,i) =>{
                                            return (
                                                <tr>
                                                    {
                                                        buildingLandUseNames[i].value % 100 === 0 && this.props.filters.length === 0 ?
                                                            <td onClick={() => {this.props.updateFilter([buildingLandUseNames[i].value])}}>
                                                                <a href={'#'}>{buildingLandUseNames[i].name}</a>
                                                            </td> :
                                                            <td>{buildingLandUseNames[i].name}</td>
                                                    }
                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') :
                                                                'list/propType/' + item
                                                        }>
                                                            {buildingLandUseData[item].count || 0}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') :
                                                                'list/propType/' + item
                                                        }>
                                                            ${numeral(buildingLandUseData[item].replacement_value).format('0,0.a') || 0}
                                                        </a>
                                                    </td>

                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') + + '/hazard/flood_100' :
                                                                'list/propType/' + item + '/hazard/flood_100'
                                                        }>
                                                            {buildingLandUseData[item].flood_100_count || 0}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') + '/hazard/flood_100' :
                                                                'list/propType/' + item + '/hazard/flood_100'
                                                        }>
                                                            ${numeral(buildingLandUseData[item].flood_100_replacement_value).format('0,0.a') || 0}                                                        </a>
                                                    </td>

                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') + '/hazard/flood_500' :
                                                                'list/propType/' + item + '/hazard/flood_500'
                                                        }>
                                                        {buildingLandUseData[item].flood_500_count || 0}
                                                        </a>
                                                    </td>

                                                    <td>
                                                        <a href={
                                                            this.props.filters.length === 0 ?
                                                                'list/propType/' + landUseSubCategoryMapping[item].join('-') + '/hazard/flood_500' :
                                                                'list/propType/' + item + '/hazard/flood_500'
                                                        }>
                                                            ${numeral(buildingLandUseData[item].flood_500_replacement_value).format('0,0.a') || 0}                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        : ''
                                }

                                </tbody>
                            </table>
                        </div>
                    </Element>
                </div>
            )
        }
    }

    render(){
        return (
            <div>{this.buildingByLandUseTable()}</div>
        )
    }

    static defaultProps = {
        geoid : [36001],
        filters : [100]
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingByLandUseTable))


/*
                    if(parseInt(propFilter) % 10 === 0 && !(parseInt(propFilter) % 100 === 0)){
                        Object.keys(data).forEach((item, i) => {
                            if(propFilter === item.slice(0,2)+'0'){
                                buildingLandUseData[item] = data[item]
                            }

                        })
                    }
                    if(!(parseInt(propFilter) % 100 === 0) && !(parseInt(propFilter) % 10 ===0)){
                        Object.keys(data).forEach((item, i) => {
                            if(propFilter === item){
                                buildingLandUseData[item] = data[item]
                            }
                        })
                    }
                     */