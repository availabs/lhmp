import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { Link } from "react-router-dom"

import Table from 'components/light-admin/tables/tableSelector'

var _ = require('lodash')



class FormTableViewer extends React.Component{
    
    fetchFalcorDeps(){
        let formType = this.props.config.type
        // get columns to display
        let formAttributes = this.props.config.columns.map(d => d.accessor);

        // get columns to filter if not displayed
        if(this.props.config.filters){
            this.props.config.filters.forEach(f => {
                if(!formAttributes.includes(f.column)){
                    formAttributes.push(f.column)    
                }
                
            })
        }
        // console.log('form attributes', formAttributes, this.props.activePlan)
        
        return this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    return this.props.falcor.get(
                        ['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes]
                    )
                }
            })
    }

    isMatch(matchee, matcher){
        matchee = matchee && typeof matchee === "string" && matchee.includes('[') ?
            matchee.replace('[', '').replace(']', '').split(',') : matchee;

        return (!matchee || !matcher) ? false :
            typeof matchee === 'string' ?
            matchee.toString() === matcher.toString() :
            matchee.map(m => m.toString()).includes(matcher.toString())
    }
    render(){
        // process data from
        let tableData = Object.values(this.props.tableList)
            .filter(d =>
                this.props.activeGeoFilter === 'true' ?
                    this.props.activeCousubid && this.props.activeCousubid.length > 5 ?
                        this.isMatch(this.props.formData[d.value[2]].value.attributes.cousub || this.props.formData[d.value[2]].value.attributes.municipality, this.props.activeCousubid) :
                        this.isMatch(this.props.formData[d.value[2]].value.attributes.county, this.props.activeGeoid) : true
            )
            .map(d => {
            return this.props.formData[d.value[2]].value.attributes
        })

        // filter data is there are filters
        // can we move this to the server? seems tricky
        if(this.props.config.filters) {
            this.props.config.filters.forEach(f => {
                tableData = tableData.filter(d => d[f.column] === f.value)
            })
        }
        
        return (
            <div style={{fontSize: this.props.fontSize ? this.props.fontSize : 'inherit'}}>
                <Table 
                    data={tableData} 
                    columns={this.props.config.columns} 
                    height={this.props.height}
                    flex={true}
                />
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: ownProps.geoId ? ownProps.geoId : state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        tableList : get(state.graph,`forms.${ownProps.config.type}.byPlanId.${state.user.activePlan}.byIndex`,{}),
        formData : get(state.graph,`forms.byId`,{}),
        
        graph : state.graph

    }
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormTableViewer))




