import React from 'react';
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { Link } from "react-router-dom"

import {SectionBox} from 'pages/Public/theme/components'
import Table from 'components/light-admin/tables/tableSelector'
import {match} from "fuzzy";
import functions from "../../pages/auth/Plan/functions";
import DisplayComps from 'components/AvlForms/displayComponents'
import AvlFormsViewData from "../AvlForms/displayComponents/viewData";
import ContentViewer from "../AvlForms/displayComponents/contentViewer";

const _ = require('lodash')

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];


class FormTableViewer extends React.Component{
    
    fetchFalcorDeps(){
        if (!this.props.activeGeoid || !this.props.activePlan) return Promise.resolve();

        let formType = this.props.config.type
        // get columns to display
        let formAttributes = this.props.config.columns.reduce((acc, d) => d.SecondaryAccessor ? [...acc, d.accessor, d.SecondaryAccessor] : [...acc, d.accessor], []);

        // get columns to filter if not displayed
        if(this.props.config.filters){
            this.props.config.filters.forEach(f => {
                if(!formAttributes.includes(f.column)){
                    formAttributes.push(f.column)    
                }
                
            })
        }

        return this.props.falcor.get(
            ['geo', counties, 'name'],
            ['forms',formType,'byPlanId',this.props.activePlan,'length'],
        )
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    return this.props.falcor.get(
                        ['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes]
                    )
                }
            })
    }


    isMatch(matchee, matcher, matchSubstring = false) {
        matchee = matchee && typeof matchee === "string" ?
            matchee.indexOf('[') !== -1 ? matchee.slice(1,-1).split(',') :
                matchee.indexOf(',') !== -1 ? matchee.split(',') : matchee : matchee;
        matcher = matcher && typeof matcher === "string" ?
            matcher.indexOf('[') !== -1 ? matcher.slice(1,-1).split(',') :
                matcher.indexOf(',') !== -1 ? matcher.split(',') : matcher : matcher;

        if (matchSubstring){
            return (!matchee || !matcher) ? false :
                typeof matchee === 'string' && typeof matcher === 'string' ?
                    matchee.toString().toLowerCase().includes(matcher.toString().toLowerCase()) ||
                    matcher.toString().toLowerCase().includes(matchee.toString().toLowerCase()):
                    typeof matchee === 'string' && typeof matcher === 'object' ?
                        matcher.filter(m =>
                            m.toString().toLowerCase().includes(matchee.toString().toLowerCase()) ||
                            matchee.toString().toLowerCase().includes(m.toString().toLowerCase())
                        ).length :
                        typeof matchee === 'object' && typeof matcher === 'string' ?
                            matchee.filter(m =>
                                m.toString().toLowerCase().includes(matcher.toString().toLowerCase()) ||
                                matcher.toString().toLowerCase().includes(m.toString().toLowerCase())
                            ).length :
                            _.intersection(matchee.map(m => m.toString().toLowerCase()), matcher.map(m => m.toString().toLowerCase())).length
        }

        return (!matchee || !matcher) ? false :
            typeof matchee === 'string' && typeof matcher === 'string' ?
                matchee.toString().toLowerCase() === matcher.toString().toLowerCase() :
                typeof matchee === 'string' && typeof matcher === 'object' ?
                    matcher.map(m => m.toString().toLowerCase()).includes(matchee.toString().toLowerCase()) :
                    typeof matchee === 'object' && typeof matcher === 'string' ?
                        matchee.map(m => m.toString().toLowerCase()).includes(matcher.toString().toLowerCase()) :
                        _.intersection(matchee.map(m => m.toString().toLowerCase()), matcher.map(m => m.toString().toLowerCase())).length
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
                                this.props.activeCousubid)
                            :
                            this.isMatch(
                                this.props.formData[d.value[2]].value.attributes.county ||
                                this.props.formData[d.value[2]].value.attributes.contact_county ||
                                this.props.formData[d.value[2]].value.attributes.community_name,
                                this.props.activeGeoid) ||  get(this.props.config, ['type']) === 'roles' /*doesn't filter for active geoid to allow other counties to show up */: true
                }
            )
            .map(d => {
            return [
                // ...Object.keys(this.props.formData[d.value[2]].value.attributes),
                ...this.props.config.columns.map(d => d.accessor),
                'viewLink', 'id']
                .reduce((a,c) => {
                    let configSettings = get(this.props.config, ['columns'], []).filter(cc => cc.accessor === c)[0];

                    if(c === 'id'){
                        a[c] = d.value[2];
                        return a;
                    }
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
                    a[c] = this.props.formData[d.value[2]].value.attributes[c];
                    if((!a[c] || ['Countywide', 'countywide'].includes(a[c])) && configSettings && configSettings.SecondaryAccessor){
                        a[c] = this.props.formData[d.value[2]].value.attributes[configSettings.SecondaryAccessor]
                    }

                    a[c] = a[c] && typeof a[c] === "string" && a[c].includes('[') ? a[c].slice(1,-1).split(',') : a[c]

                    if(['cousub', 'municipality', 'contact_municipality', 'county', 'contact_county', 'community_name'].includes(c)){
                        a[c] = typeof a[c] === 'string' ? functions.formatName(get(this.props.geoData, [a[c]], a[c]), a[c]) :
                            a[c] ? a[c].map(subC => functions.formatName(get(this.props.geoData, [subC], subC), subC)) : a[c]
                    }

                    if (configSettings && configSettings.displayType === 'AvlFormsJoin'){

                        if(typeof a[c] === "string") { a[c] = [a[c]]}
                        a[c].reduce((acc,newC) => {
                            return acc.then((resAcc) => {
                                return this.props.falcor.get(['forms', 'byId', newC])
                            })
                        },Promise.resolve())
                        a[c] = a[c].map(newC => get(this.props.falcor.getCache(), [ 'forms', 'byId', newC, 'value', 'attributes', configSettings.formAttribute]) )
                            .filter(newC => newC)
                    }

                    if (configSettings && configSettings.displayType === 'contentViewer'){
                        a[c] =
                            <ContentViewer
                                state={{[c]: this.props.formData[d.value[2]].value.attributes[c]}}
                                title={c}
                            />
                    }

                    a[c] = typeof a[c] !== "object" ? a[c] : a[c] && a[c].length ? a[c].join(',') : a[c]

                    if(this.props.config.combineCols){
                        let combinationKey = Object.keys(this.props.config.combineCols).filter(cc => this.props.config.combineCols[cc].includes(c))[0]
                        if (combinationKey){
                            a[combinationKey] = a[combinationKey] ? `${a[combinationKey]} ${a[c]}` : a[c]
                        }
                    }
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
        if(this.props.config.filters && tableData) {
            this.props.config.filters.forEach(f => {
                tableData = tableData
                    .filter(d => d[f.column])
                    .filter(d => this.isMatch(f.value, d[f.column], this.props.config.matchSubString))
            })
        }

        let columns = this.props.config.combineCols ?
            [
                ...Object.keys(this.props.config.combineCols)
                    .map(col => ({
                        'Header': col,
                        accessor: col,
                        sort: this.props.config.combineCols[col].reduce((a,c) => a || c.sort, false),
                        filter: this.props.config.combineCols[col].reduce((a,c) => a || c.filter, null)
                    })),
                ...this.props.config.columns
            ] : this.props.config.columns
        return (
            <div style={{fontSize: this.props.fontSize ? this.props.fontSize : 'inherit'}}>
                {get(this.props.config, 'description', null) ? 
                    <SectionBox>{this.props.config.description}</SectionBox> : ''
                }
                <Table 
                    data={tableData} 
                    columns={
                        columns
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
        geoData: {
            ...get(state.geo, ['allGeos'], {}),
            ...Object.keys(get(state, ['graph', 'geo'], {}))
                .filter(curr => curr !== 'allGeos')
                .reduce((acc, curr) => {
                    acc[curr] = get(state, ['graph', 'geo', curr, 'name']);
                    return acc;
            }, {}),
        },
        graph : state.graph

    }
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormTableViewer))




