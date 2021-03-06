import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import GraphFactory from 'components/AvlForms/displayComponents/graphFactory.js'
import {getAllGeo} from 'store/modules/geo'
import functions from "../../../pages/auth/Plan/functions";
import ElementFactory from "../../../pages/Public/theme/ElementFactory";
var _ = require('lodash')

const counties = ["36","36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsViewData extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id : '',
            county: '',
            cousub: ''
        }
    }

    componentDidUpdate(prevProps) {
        if(!_.isEqual(this.props.id, prevProps.id)){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        let id = []
        if (this.props.id[0].includes("[")) {
            id = this.props.id[0].substr(1)
        } else if (this.props.id[0].includes("]")) {
            id = this.props.id[0].substring(0, this.props.id[0].length - 1);
        } else {
            id = this.props.id
        }
        if (!id || id[0] === '') return Promise.resolve();

        return this.props.falcor.get(['forms', 'byId', id])
            .then(response => {
                this.setState({
                    id: id
                })
                let graph = get(response, `json.forms.byId[${id}].attributes`, {});
                Object.keys(graph).filter(d => d !== '$__path').forEach(item => {
                    let value = get(graph, [item], null);
                    value = value ? value.toString() : value;
                    value = value && value.includes('[') ?
                        value.replace('[', '').replace(']', '').split(',') : value;
                    if (value && typeof value === "object"){
                        value.forEach(v => {
                            if(v && v.toString().substring(0,2) === '36' && counties.includes(v)){
                                this.props.getAllGeo(v)
                                this.setState({county: v})
                            }
                            if(v &&
                                ((get(this.props.geoRelations, [this.state.county], null) &&
                                    this.props.geoRelations[this.state.county].includes(v)) ||
                                    (v.toString().substring(0,5) === this.state.county && value.length === 10)
                                )
                            ){
                                this.setState({cousub: value})
                            }
                        })
                    }else{
                        if(value && value.toString().substring(0,2) === '36' && counties.includes(value)){
                            this.props.getAllGeo(value)
                            this.setState({county: value})
                        }
                        if(value &&
                            ((
                                get(this.props.geoRelations, [this.state.county], []).includes(value)) ||
                                (this.props.config[0].type === 'comments' && get(this.props.geoRelations, [this.props.activeGeoid], []).includes(value)) ||
                                (value.toString().substring(0,5) === this.state.county && value.length === 10))
                        ){
                            this.setState({cousub: value})
                        }
                    }

                    if (this.state.county.length !== 0) {
                        this.props.falcor.get(['geo', this.state.county, ['name']])
                            .then(response => {
                                return response
                            })
                    }
                    if (this.state.cousub.length !== 0) {
                        this.props.falcor.get(['geo', this.state.cousub, ['name']])
                            .then(response => {
                                return response
                            })
                    }

                    return response
                })
            })
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    formsViewData(){
        let graph = this.props.formsViewData[this.state.id];
        let geoData = this.props.geoData;
        let data = [];
        let config_attributes = this.props.config.map(d => Object.keys(d.attributes));
        let missing_attributes = [];
        let config = this.props.config.map(d => d.attributes);
        if(graph){
            Object.keys(graph).filter(d => d !== '$type').forEach(item =>{
                Object.keys(config[0]).forEach((d,i) =>{
                    let section = get(config[0][d], `section`, null),
                        label = get(config[0][d], `label`, null),
                        displayType = get(config[0][d], `display_type`, null),
                        formType = get(config[0][d], `form_type`, null),
                        parentConfig = get(config[0][d], `parentConfig`, null),
                        targetConfig = get(config[0][d], `targetConfig`, null),
                        targetKey = get(config[0][d], `targetKey`, null),
                        display_location_in_table = get(config[0][d], `display_location_in_table`, null);

                    let value = get(graph, `[${item}].attributes[${d}]`, null)
                    value = value && !this.isJsonString(value) ? value.toString() : value;
                    value = value && typeof value !== "number" && value.indexOf('[') === 0 && value.indexOf(']') === value.length - 1 ?
                        value.replace('[', '').replace(']', '').split(',') : value;

                    if(config_attributes[0].includes(d)){
                        if(
                            value && (typeof value === "string" && typeof this.state.county === "string" && value === this.state.county ||
                            typeof value === "object" && typeof this.state.county === "string" && value.includes(this.state.county) ||
                            typeof value === "object" && typeof this.state.county === "object" && _.isEqual(value, this.state.county) ||
                            typeof value === "string" && typeof this.state.county === "object" && this.state.county.includes(value)) ||

                            (
                                value && (typeof value === "string" && typeof this.state.cousub === "string" && value === this.state.cousub ||
                                    typeof value === "object" && typeof this.state.cousub === "string" && value.includes(this.state.cousub) ||
                                    typeof value === "object" && typeof this.state.cousub === "object" && _.isEqual(value, this.state.cousub) ||
                                    typeof value === "string" && typeof this.state.cousub === "object" && this.state.cousub.includes(value))
                            )
                        ){
                            /*value =
                                value &&
                                value.includes('[') &&
                                value !== this.state.county ? value.replace('[', '').replace(']', '') :
                                    value*/
                            data.push({
                                attribute : d,
                                value:
                                typeof value === "string" ?
                                        geoData[value] ?
                                            functions.formatName(geoData[value].name, value) :
                                            this.props.config[0].attributes[d].defaultValue || 'None' :
                                typeof value === "object" ?
                                        value.map(v =>
                                            geoData[v] ?
                                                functions.formatName(geoData[v].name, v) :
                                                this.props.config[0].attributes[d].defaultValue || 'None'
                                        ).join(', ') : 'None',
                                section,
                                label,
                                displayType,
                                formType,
                                parentConfig,
                                targetConfig,
                                targetKey,
                                display_location_in_table
                            })
                        }
                        else{
                            if( !config[0][d].hidden || config[0][d].hidden !== 'true'){
                                data.push({
                                    attribute:d,
                                    value: value ? value.toString() || 'None' : '',
                                    section,
                                    label,
                                    displayType,
                                    formType,
                                    parentConfig,
                                    targetConfig,
                                    targetKey,
                                    display_location_in_table
                                })
                            }

                        }
                    }
                    else{
                        if(d !== 'sub_type' && d !== 'type' && d !=='plan_id'){
                            missing_attributes = config_attributes[0].filter(i => Object.keys(config[0]).indexOf(i) < 0);
                            missing_attributes.forEach(ma =>{
                                let renamed_column = config[0][ma].rename_column;
                                let section = get(config[0][ma], `section`, null),
                                    label = get(config[0][ma], `label`, null),
                                    displayType = get(config[0][d], `display_type`, null),
                                    formType = get(config[0][d], `form_type`, null),
                                    parentConfig = get(config[0][d], `parentConfig`, null),
                                    targetConfig = get(config[0][d], `targetConfig`, null),
                                    targetKey = get(config[0][d], `targetKey`, null),
                                    display_location_in_table = get(config[0][d], `display_location_in_table`, null);

                                if(renamed_column){
                                    Object.keys(renamed_column).forEach(rc =>{
                                        if(graph[item].attributes[rc]){
                                            if(graph[item].attributes[rc] === this.state.county || graph[item].attributes[rc] === this.state.cousub){
                                                data.push({
                                                    attribute : ma,
                                                    value: geoData[graph[item].attributes[rc]] ?
                                                        functions.formatName(geoData[graph[item].attributes[rc]].name, graph[item].attributes[rc])
                                                        : 'None',
                                                    section,
                                                    label,
                                                    displayType,
                                                    formType,
                                                    parentConfig,
                                                    targetConfig,
                                                    targetKey,
                                                    display_location_in_table
                                                })
                                            }else{
                                                data.push({
                                                    attribute : ma,
                                                    value : graph[item].attributes[rc],
                                                    section,
                                                    label,
                                                    displayType,
                                                    formType,
                                                    parentConfig,
                                                    targetConfig,
                                                    targetKey,
                                                    display_location_in_table
                                                })
                                            }
                                        }else{
                                            renamed_column[rc].forEach(rcc =>{
                                                if(graph[item].attributes[rcc]){
                                                    if(graph[item].attributes[rcc] === this.state.county || graph[item].attributes[rcc] === this.state.cousub){
                                                        data.push({
                                                            attribute : ma,
                                                            value: geoData[graph[item].attributes[rcc]] ?
                                                                functions.formatName(geoData[graph[item].attributes[rcc]].name, graph[item].attributes[rcc])
                                                                : 'None',
                                                            section,
                                                            label,
                                                            displayType,
                                                            formType,
                                                            parentConfig
                                                        })
                                                    }else{
                                                        data.push({
                                                            attribute : ma,
                                                            value : graph[item].attributes[rcc],
                                                            section,
                                                            label,
                                                            displayType,
                                                            formType,
                                                            parentConfig,
                                                            targetConfig,
                                                            targetKey,
                                                            display_location_in_table
                                                        })
                                                    }
                                                }

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            })

        }

        return _.uniqBy(data,'attribute')

    }

    render(){
        let data = this.formsViewData();
        let graphType = get(this.props.config, [0, 'type']) || get(this.props.config, ['type'])
        return(
            <React.Fragment>
                <GraphFactory
                    graph={{type: ['comments', 'contentViewer'].includes(graphType) ? graphType : 'text'}}
                    data={data}
                    config={this.props.config}
                    isVisible = {true}
                    autoLoad={this.props.autoLoad}
                    showHeader={this.props.showHeader}
                >
                </GraphFactory>
                {
                    this.props.subJson && data && data.length ?
                        <div className='element-box'>
                            <ElementFactory
                                element={
                                    Object.keys(this.props.subJson)
                                        .reduce((a,c) => {
                                            if(c === 'config' && !this.props.subJson[c].filters && this.props.subJson[c].filterCol){
                                                a[c] = {...this.props.subJson[c], ...{filters: [{column:'id',value:get(data.filter(d => d.attribute === this.props.subJson[c].filterCol), [0, 'value'])}] }}
                                                return a;
                                            }
                                            a[c] = this.props.subJson[c];
                                            return a;
                                        },{})
                                }
                            />
                        </div>: null
                }
            </React.Fragment>
        )
    }
}
AvlFormsViewData.defaultProps = {
    showHeader: true
}
const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        formsViewData : get(state.graph,['forms','byId'],{}),
        geoData : get(state.graph,['geo'],{}),
        geoRelations: state.geo.geoRelations,
        id : ownProps.id
    }
};

const mapDispatchToProps = {
    sendSystemMessage, getAllGeo
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsViewData))

