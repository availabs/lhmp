import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import {falcorChunkerNiceWithUpdate} from "store/falcorGraph"
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'
var _ = require('lodash/core');


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
        return this.props.falcor.get(['building','byGeoid',this.props.geoid,'propType',propTypes,'sum',['count','replacement_value']])

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
                let categories = [];
                let count_sum = 0;
                let replacement_value_sum = 0;
                Object.keys(data).forEach(item =>{
                    if(parseInt(item) % 100 === 0) {
                        categories.push(item)
                    }
                    categories.map((category,i)=>{
                        if(category.slice(0,1) === item.slice(0,1)){
                            count_sum += parseFloat(data[item].sum.count.value) || 0
                            replacement_value_sum += parseFloat(data[item].sum.replacement_value.value) || 0
                            buildingLandUseData[category] = {
                                "sum":{"count":{"value":count_sum},"replacement_value":{"value":replacement_value_sum}}
                            }
                        }

                    })

                });
            }
            else{
                let data = this.props.data[this.props.geoid].propType;
                this.props.filters.forEach(propFilter =>{
                    if(parseInt(propFilter) % 100 === 0) {
                        Object.keys(data).forEach((item, i) => {
                            if(propFilter.slice(0,1) === item.slice(0,1)){
                                buildingLandUseData[item] = data[item]
                            }

                        })
                    }

                });

            }
            BuildingByLandUseConfig.map((config)=>{
                Object.keys(buildingLandUseData).forEach((data)=>{
                    if(data === config.value){
                        buildingLandUseNames.push(config.name)
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
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    buildingLandUseData !== undefined ?
                                        Object.keys(buildingLandUseData).map((item,i) =>{
                                            return (
                                                <tr>
                                                    <td>{buildingLandUseNames[i]}</td>
                                                    <td>{buildingLandUseData[item].sum.count.value || 0}</td>
                                                    <td>${buildingLandUseData[item].sum.replacement_value.value || 0}</td>
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