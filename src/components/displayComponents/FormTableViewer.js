import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { Link } from "react-router-dom"

import {SectionBox} from 'pages/Public/theme/components'
import Table from 'components/light-admin/tables/tableSelector'
import {match} from "fuzzy";
import functions from "../../pages/auth/Plan/functions";

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

        return this.props.falcor.get(
            ['forms',formType,'byPlanId',this.props.activePlan,'length'],
            ["geo", this.props.activeGeoid, 'municipalities']
        )
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    return this.props.falcor.get(
                        ['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes],
                        ['geo',
                            [this.props.activeGeoid, ...get(this.props.geoData, `${this.props.activeGeoid}.municipalities.value`, [])],
                            ['name']]
                    )
                }
            })
    }

    isMatch(matchee, matcher){
        matchee = matchee && typeof matchee === "string" && matchee.includes('[') ?
            matchee.slice(1,-1).split(',') : matchee;

        return (!matchee || !matcher) ? false :
            typeof matchee === 'string' ?
            matchee.toString() === matcher.toString() :
            matchee.map(m => m.toString()).includes(matcher.toString())
    }
    render(){
        // process data from
        let tableData = Object.values(this.props.tableList)
            .filter(d => {
                    return this.props.activeGeoFilter === 'true' ?
                        this.props.activeCousubid && this.props.activeCousubid.length > 5 ?
                            this.isMatch(
                                this.props.formData[d.value[2]].value.attributes.cousub ||
                                this.props.formData[d.value[2]].value.attributes.municipality ||
                                this.props.formData[d.value[2]].value.attributes.contact_municipality ||
                                this.props.formData[d.value[2]].value.attributes.community_name,
                                this.props.activeCousubid) :
                            this.isMatch(
                                this.props.formData[d.value[2]].value.attributes.county ||
                                this.props.formData[d.value[2]].value.attributes.contact_county ||
                                this.props.formData[d.value[2]].value.attributes.community_name,
                                this.props.activeGeoid) : true
                }
            )
            .map(d => {

            return [...Object.keys(this.props.formData[d.value[2]].value.attributes), 'viewLink']
                .reduce((a,c) => {

                    if (this.props.viewLink && c === 'viewLink'){
                        a['viewLink'] =
                            <a href={
                                this.props.config.subType ?
                                `/${this.props.config.type}/view/${this.props.config.subType}/${this.props.formData[d.value[2]].value.id}/p` :
                                `/${this.props.config.type}/view/${this.props.formData[d.value[2]].value.id}/p`
                            } target={'_blank'}>
                                <i className="os-icon os-icon-mail-19"></i>
                            </a>
                        return a;
                    }

                    a[c] = this.props.formData[d.value[2]].value.attributes[c]

                    a[c] = a[c] && typeof a[c] === "string" && a[c].includes('[') ? a[c].slice(1,-1).split(',') : a[c]

                    if(['cousub', 'municipality', 'contact_municipality', 'county', 'contact_county', 'community_name'].includes(c)){
                        a[c] = typeof a[c] === 'string' ? functions.formatName(get(this.props.geoData, [a[c], 'name'], a[c]), a[c]) :
                            a[c] ? a[c].map(subC => functions.formatName(get(this.props.geoData, [subC, 'name'], subC), subC)) : a[c]
                    }

                    a[c] = typeof a[c] !== "object" ? a[c] : a[c] && a[c].length ? a[c].join(',') : a[c]
                    return a;
                }, {})
        })
            .sort((a, b) =>
                this.props.defaultSortCol ?
                    (this.props.defaultSortOrder === 'desc' ? -1 : 1)*(typeof a[this.props.defaultSortCol] === "string" ?
                    a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                    b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                    1)

        // filter data is there are filters
        // can we move this to the server? seems tricky
        if(this.props.config.filters) {
            this.props.config.filters.forEach(f => {
                tableData = tableData
                    .filter(d => d[f.column])
                    .filter(d =>
                typeof f.value === 'string' ? d[f.column].toLowerCase().includes(f.value.toLowerCase()) :
                f.value.filter(oldF => oldF.toLowerCase().includes(d[f.column].toLowerCase())).length)
            })
        }
        return (
            <div style={{fontSize: this.props.fontSize ? this.props.fontSize : 'inherit'}}>
                {get(this.props.config, 'description', null) ? 
                    <SectionBox>{this.props.config.description}</SectionBox> : ''
                }
                <Table 
                    data={tableData} 
                    columns={
                        this.props.config.columns
                            .reduce((a,c, cI, src) => {
                                if (this.props.colOrder){
                                    let tmpCol = src.filter(s => s.Header === this.props.colOrder[cI]).pop()
                                    if (tmpCol) a.push(tmpCol)
                                }else{
                                    a.push(c)
                                }
                                return a;
                            }, [])
                    }
                    height={this.props.minHeight}
                    flex={Boolean(this.props.flex) ? this.props.flex === 'true' : true}
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
        geoData: get(state.graph, ['geo'], {}),
        graph : state.graph

    }
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormTableViewer))




