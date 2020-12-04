import React from 'react';
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import GraphFactory from 'components/AvlForms/editComponents/graphFactory.js';
import styled from "styled-components";
import {falcorGraph} from "../../../store/falcorGraph";
import config from "../../../pages/auth/Plan/config/guidance-config";
import {Link} from "react-router-dom";
import attributes from "../../../pages/auth/megaAvlFormsConfig";

var _ = require("lodash");

const counties = [
    "36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119",
    "36049", "36069", "36023","36085","36029","36079","36057","36105","36073","36065","36009",
    "36123","36107","36055", "36095","36007", "36083","36099","36081","36037","36117","36063","36047",
    "36015","36121","36061","36021","36013","36033","36017", "36067","36035","36087","36051","36025",
    "36071","36093","36005"
];
const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;

class AvlFormsNewData extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        // this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this);


    }

    fetchFalcorDeps(){
        let form_type = this.props.config.map(d => d.type);

        return this.props.falcor.get(['geo',counties,['name']])
            .then(() =>{
                this.props.falcor.get(['forms',form_type,'meta'])
                    .then(response =>{
                        return response
                    })
                // to get the roleIds with logged in user`s email
                this.props.falcor.get(['forms',['roles'],'byPlanId',this.props.activePlan,'length'])
                    .then(response =>{
                        let length = response.json.forms['roles'].byPlanId[this.props.activePlan].length
                        this.props.falcor.get(['forms',['roles'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['contact_email']])
                            .then(response =>{
                                return response
                            })
                    })
            })
    }

    handleChange(e){
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    componentDidMount(){
        if(this.props.id[0]){
            let attributes = this.props.config.map(d => Object.keys(d.attributes));
            return this.props.falcor.get(['forms','byId',this.props.id])
                .then(response =>{
                    let graph = response.json.forms.byId[this.props.id];
                    let tmp_state = {}
                    if(graph && attributes[0]){
                        attributes[0].forEach(attribute =>{
                            if (
                                graph.attributes[attribute] &&
                                typeof graph.attributes[attribute] === 'object' &&
                                Object.keys(graph.attributes[attribute]).length === 1 &&
                                Object.keys(graph.attributes[attribute])[0] === '$type'
                            ){
                                graph.attributes[attribute] = null
                            }
                            if(attribute.includes('date') && !attribute.includes('update')){

                                let d = graph.attributes[attribute] ? graph.attributes[attribute].toString().split('-') : ''
                                if(d[0] && d[1] && d[2]){
                                    let date = d[0] +'-'+ d[1] +'-'+ d[2] // 10/30/2010
                                    tmp_state[attribute] = date
                                }
                                else{
                                    tmp_state[attribute] = undefined
                                }
                            }else{
                                if(graph.attributes[attribute] && typeof graph.attributes[attribute] === "string" && graph.attributes[attribute].includes("[")){
                                    tmp_state[attribute] = graph.attributes[attribute].slice(1,-1).split(",")
                                }else{
                                    tmp_state[attribute] = graph.attributes[attribute]
                                }

                            }

                        });
                        this.setState(
                            tmp_state
                        )
                    }
                })
        }else if(!this.props.id[0]){
            if(this.props.data){
                let tmp_state = {}
                Object.keys(this.props.data).forEach(d =>{
                    tmp_state[d] = this.props.data[d]
                })
                this.setState(
                    tmp_state
                )
            }
        }

    }
    componentDidUpdate(prevProps, prevState) {
        let countyAttrs = Object.keys(this.state).filter(f => f.includes('county'))
        if (countyAttrs.reduce((a,c) => a || !_.isEqual(prevState[c], this.state[c]), false)){
            this.cousubDropDown({target:{value:this.state[countyAttrs.pop()]}})
        }
    }

    displayPrompt(id){
        return (
            <div>
                <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                        onClick={
                            (e) => document.getElementById('closeMe'+id).style.display =
                                document.getElementById('closeMe'+id).style.display === 'block' ? 'none' : 'block'
                        }
                        style={{'float': 'right'}}> ?
                </button>
                <div aria-labelledby="mySmallModalLabel"
                     className="onboarding-modal modal fade animated show" role="dialog"
                     id={`closeMe`+id}
                     tabIndex="0"
                     style={{display: 'none', margin: '0vh 0vw'}}
                     onClick={(e) => {
                         if (e.target.id === `closeMe`+id){
                             e.target.closest(`#closeMe`+id).style.display = 'none'
                         }
                     }}
                     aria-hidden="true">
                    <div className="modal-dialog modal-centered modal-bg" style={{width: '100%', height: '50%', padding: '5vh 5vw'}}>
                        <DIV className="modal-content text-center" style={{width: '100%', height: '100%', overflow: 'auto'}}>
                            <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                        onClick={(e) => {
                                            e.target.closest(`#closeMe`+id).style.display = 'none'
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div className="modal-body" style={{textAlign: 'justify'}}>
                                {this.props.config.map(item =>{
                                    return (<div key={id}>{item.attributes[id].prompt}</div>)
                                })}
                            </div>

                            {
                                this.props.config.map(item =>{
                                return item.attributes[id].example ?
                                    <React.Fragment>
                                        <div className="modal-header"><h6 className="modal-title">Example</h6></div>
                                        <div className="modal-body" style={{textAlign: 'justify'}}>
                                            {this.props.config.map(item =>{
                                                return (<div>{item.attributes[id].example}</div>)
                                            })}
                                        </div>
                                    </React.Fragment> : null
                                })
                            }

                        </DIV>
                    </div>
                </div>
            </div>
        )
    }

    afterSubmitEdit(newId, attributes){
        return attributes.reduce((a,c) => {
            return a.then(resA => {
                return get(this.state, [c], []).reduce((a1,c1) => {
                    return a1.then(resA1 => {
                        return this.props.falcor.get(['forms', 'byId',c1,'attributes',this.props.config[0].attributes[c].parentConfig])
                            .then(originalData => {
                                originalData = get(originalData, ['json', 'forms', 'byId',c1,'attributes',this.props.config[0].attributes[c].parentConfig], '')

                                originalData = originalData.indexOf(']') > -1 ?
                                    `[${
                                    _.uniqBy([...originalData.slice(1,-1).split(','), newId]).filter(od => od && od !== '').join(',')
                                }]` :
                                    originalData && originalData !== '' ?
                                    `[${originalData},${newId}]` : `[${newId}]`

                                return this.props.falcor.set({
                                    paths: [
                                        ['forms', 'byId',c1,'attributes',this.props.config[0].attributes[c].parentConfig]
                                    ],
                                    jsonGraph: {
                                        forms:{
                                            byId:{
                                                [c1] : {
                                                    attributes : {[this.props.config[0].attributes[c].parentConfig]: originalData}
                                                }
                                            }
                                        }
                                    }
                                })
                            })
                    })
                }, Promise.resolve())
            })
        }, Promise.resolve())
            .then(response => {
                // this.props.sendSystemMessage(`${type[0]} was successfully edited.`, {type: "success"});
            })
    }

    onSubmit(e){
        e.preventDefault();
        let editAfterSubmitAttributes =
            Object.keys(get(this.props, `config[0].attributes`, {}))
                .filter(attribute => this.props.config[0].attributes[attribute].edit_type === 'AvlFormsJoin')
        let type = this.props.config.map(d => d.type);
        if(this.props.id[0]){
            let attributes = Object.keys(this.state)
            let action_status_update = []
            Object.keys(this.state).forEach(attribute =>{
                if(attribute === 'action_status_update'){
                    action_status_update = this.state[attribute]
                }
            })
            let edit_attributes = Object.keys(this.state).reduce((a,c) =>{
                if(this.state[c]){
                    if(typeof this.state[c] === "object"){
                        a[c] = '['+this.state[c].toString()+']'
                    }else{
                        a[c] = typeof this.state[c] === "string" ? this.state[c].replaceAll('\'', '\'\'') : this.state[c]
                    }
                }
                return a;
            },{})

            return this.props.falcor.set({
                paths: [
                    ['forms', 'byId',this.props.id[0],'attributes',attributes]
                ],
                jsonGraph: {
                    forms:{
                        byId:{
                            [this.props.id[0]] : {
                                attributes : edit_attributes
                            }
                        }
                    }
                }
            })
                .then(response => {
                    if (this.props.returnValue){
                        this.props.returnValue(Object.keys(get(response, `json.forms.${type[0]}.byId`, {[null]:null}))[0])
                    }
                    this.afterSubmitEdit(Object.keys(get(response, `json.forms.byId`, {[null]:null}))[0], editAfterSubmitAttributes)
                        .then(r => this.props.sendSystemMessage(`${type[0]} was successfully edited.`, {type: "success"}))
                })
                .then(response => this.props.onFinish ? this.props.onFinish : response)

        }else{
            let args = []
            let plan_id = parseInt(this.props.activePlan);
            let attributes = {};
            let sub_type = '';
            let user_email = this.props.userEmail;
            let owner_ids = []
            // to find role ids for the logged in user to be inserted in participation time
            Object.keys(this.props.forms_roles_data).forEach(d =>{
                if(this.props.forms_roles_data[d].value && this.props.forms_roles_data[d].value.attributes.contact_email === user_email){
                    owner_ids.push(this.props.forms_roles_data[d].value.id)
                }
            })
            this.props.config.forEach(config =>{
                Object.keys(config.attributes).forEach(item =>{
                    if(get(config, `attributes.${item}.sub_type`, '').length > 0){
                        sub_type = config.attributes[item].sub_type
                    }
                })
            })
            Object.keys(this.state).forEach(item =>{
                if(sub_type.length > 0){
                    if(sub_type === 'time'){
                        attributes['sub_type'] = sub_type
                        attributes[item] = this.state[item]
                        attributes['owner_id'] = owner_ids
                    }else{
                        attributes['sub_type'] = sub_type
                        attributes[item] = this.state[item]
                    }

                }else{
                    if(typeof this.state[item] === "object"){
                        attributes[item] = "[" + this.state[item].toString() +"]"
                    }else{
                        attributes[item] = this.state[item]//.replaceAll('\'', '\'\'')
                    }
                }
            });

            args.push(type[0],plan_id,attributes);
            return this.props.falcor.call(['forms','insert'], args, [], [])
                .then(response => {
                    if (this.props.returnValue){
                        this.props.returnValue(Object.keys(get(response, `json.forms.${type[0]}.byId`, {[null]:null}))[0])
                    }
                    this.afterSubmitEdit(Object.keys(get(response, `json.forms.${type[0]}.byId`, {[null]:null}))[0], editAfterSubmitAttributes)
                        .then(r => this.props.sendSystemMessage(`${type[0]} was successfully created.`, {type: "success"}))
                })
                .then(response => this.props.onFinish ? this.props.onFinish() : response)
        }
    }

    cousubDropDown(event){
        let county = typeof event.target.value === "object" ? event.target.value : [event.target.value];
        if(county && county !== 'None'){
            return this.props.falcor.get(['geo',county,'municipalities'])
                .then(response =>{
                    let cousubs = [];
                    county.map(c => cousubs.push(...get(response, `json.geo[${c}].municipalities`, []).filter(f => f)));
                    if (cousubs){
                        this.props.falcor.get(['geo',cousubs,['name']])
                            .then(response =>{
                                return response
                            })
                    }
                })
        }else{
            return null
        }
    }

    geoData(){
        let countyData = [];
        let cousubsData = [];
        let graph = this.props.geoData;
        let countyAttrs = Object.keys(this.state).filter(f => f.includes('county'))
        let filterOn = this.state[countyAttrs.pop()]
        if(graph){
            // let graph = this.props.geoData;
            Object.keys(graph).forEach(item =>{
                if(item.length === 5){
                    countyData.push({
                        value : item,
                        name: graph[item].name
                    })
                }
            })
            Object.keys(graph)
                .filter(item => filterOn && filterOn.includes(item.toString()))
                .forEach(item =>{

                    get(graph, `${item}.municipalities.value`, [])
                        .filter(cousub => get(graph, `${cousub}.name`, null))
                        .forEach(cousub => {
                        cousubsData.push({
                            value : cousub,
                            name : get(graph, `${cousub}.name`, '')
                        })
                    })
            })
        }
        return [countyData,cousubsData]
    }
    handleMultiSelectFilterChange(e, id, domain=[]) {
        if (!e) return;
        let tmpObj = {};
        if (e.includes('Select All') && domain.length > 0){
            tmpObj[id] = domain.filter(f => f !== 'Select All' && f !== 'Select None');
        }else if (e.includes('Select None')){
            tmpObj[id] = [];
        }else{
            tmpObj[id] = [...e];
        }
        this.setState(tmpObj);
    }

    implementData(){
        let data = [];
        let countyData = this.geoData()[0];
        let cousubsData = this.geoData()[1];
        let meta_data = [],
            fieldSpecificMeta = {}
        let form_type = this.props.config.map(d => d.type)[0];
        if(this.props.meta_data) {
            let graph = this.props.meta_data;
            if(graph[form_type] && graph[form_type].meta){
                graph[form_type].meta.value
                    .filter(f => f.form_type.split(`${form_type}-`).length > 1)
                    .filter(f => get(this.props.config[0],[ 'attributes', f.form_type.split(`${form_type}-`)[1], 'metaSource'], null) !== 'meta_file')
                    .map(f => {
                        let field = f.form_type.split(`${form_type}-`)[1]
                        if (fieldSpecificMeta[field]){
                            fieldSpecificMeta[field].push(f)
                        }else{
                            fieldSpecificMeta[field] = [f]
                        }
                    })
                meta_data = graph[form_type].meta ? graph[form_type].meta.value.filter(f => f.form_type.split(`${form_type}-`).length === 1) : []
            }
        }

        // get meta from file
        // for fields which have meta from file, meta from db will be overridden
        if(this.props.meta){
            this.props.meta
                .filter(f => f.form_type.split(`${form_type}-`).length > 1)
                .forEach(f => {
                    f.form_type.split(`-`).slice(1, f.form_type.split(`-`).length)
                        .filter(field => get(this.props.config[0], ['attributes', field, 'metaSource'], null) === 'meta_file')
                        .forEach(field => {
                            if (fieldSpecificMeta[field] && !fieldSpecificMeta[field].includes(f)){
                                fieldSpecificMeta[field].push(f)
                            }else{
                                fieldSpecificMeta[field] = f.value ? f.value : [f]
                            }
                        })

                })
            // meta_data = this.props.meta.filter(f => f.form_type.split(`-`).length === 1)
        }

        if (!countyData.length) return null;
        this.props.config.forEach(item =>{
            Object.keys(item.attributes).forEach(attribute =>{

                if(item.attributes[attribute].area === 'true' &&
                    item.attributes[attribute].edit_type === 'dropdown' &&
                    item.attributes[attribute].meta === 'true' && item.attributes[attribute].depend_on === undefined
                    && ['false', undefined].includes(item.attributes[attribute].hidden)
                ){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        //handleChange : this.handleChange,
                        handleMultiSelectFilterChange : this.handleMultiSelectFilterChange.bind(this),
                        state : this.state,
                        title : attribute,
                        data_error : item.attributes[attribute].data_error,
                        required: item.attributes[attribute].field_required,
                        placeholder: item.attributes[attribute].placeholder,
                        type: 'multiselect',//item.attributes[attribute].edit_type,
                        addAll: item.attributes[attribute].addAll,
                        meta : countyData || [],
                        area:item.attributes[attribute].area,
                        prompt: this.displayPrompt.bind(this),
                        onClick : this.cousubDropDown.bind(this),
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }else if(item.attributes[attribute].area === 'true' &&
                    item.attributes[attribute].depend_on &&
                    item.attributes[attribute].edit_type === 'dropdown' &&
                    item.attributes[attribute].meta === 'true'
                    && ['false', undefined].includes(item.attributes[attribute].hidden)){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        //handleChange : this.handleChange,
                        handleMultiSelectFilterChange : this.handleMultiSelectFilterChange.bind(this),
                        state : this.state,
                        title : attribute,
                        required: item.attributes[attribute].field_required,
                        placeholder: item.attributes[attribute].placeholder,
                        type: 'multiselect',//item.attributes[attribute].edit_type,
                        addAll: item.attributes[attribute].addAll,
                        depend_on : item.attributes[attribute].depend_on,
                        area:item.attributes[attribute].area,
                        prompt: this.displayPrompt.bind(this),
                        meta : cousubsData || [],
                        geoRelations: this.props.geoRelations,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }else if(item.attributes[attribute].area === undefined && item.attributes[attribute].edit_type === 'dropdown' &&
                    item.attributes[attribute].meta === 'true'){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        //handleChange : this.handleChange,
                        handleMultiSelectFilterChange : this.handleMultiSelectFilterChange.bind(this),
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        type: 'multiselect', //item.attributes[attribute].edit_type,
                        addAll: item.attributes[attribute].addAll,
                        required: item.attributes[attribute].field_required,
                        meta: get(item, `attributes.${attribute}.meta_filter.value`, null) &&
                        get(item, `attributes.${attribute}.meta_filter.filter_key`, null) === '' ?
                            get(item, `attributes.${attribute}.meta_filter.value`, []) :
                            fieldSpecificMeta[attribute] ? fieldSpecificMeta[attribute]: meta_data ? meta_data : [],
                        prompt: this.displayPrompt.bind(this),
                        depend_on : item.attributes[attribute].depend_on,
                        defaultValue: item.attributes[attribute].defaultValue

                    })
                }else if((item.attributes[attribute].edit_type === 'radio' ||
                    item.attributes[attribute].edit_type === 'checkbox')
                    && ['false', undefined].includes(item.attributes[attribute].hidden)
                ){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        inline: item.attributes[attribute].inline,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        values:item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }else if(item.attributes[attribute].edit_type === 'form_array'){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        MainType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        defaultValue: item.attributes[attribute].defaultValue,
                        addText: item.attributes[attribute].add_text,
                        formType: item.attributes[attribute].form_type,
                        columnMap: item.attributes[attribute].column_map,
                        autoLoad: true
                    })
                }
                else if(item.attributes[attribute].edit_type === 'dropdown_no_meta' && item.attributes[attribute].disable_condition){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        disable_condition : item.attributes[attribute].disable_condition,
                        dropDownData : item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }
                else if(item.attributes[attribute].edit_type === 'dropdown_no_meta'){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        dropDownData : item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }
                else if(item.attributes[attribute].edit_type === 'dropdown_no_meta'){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        dropDownData : item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }
                else if(item.attributes[attribute].edit_type === 'dropdown_no_meta' && item.attributes[attribute].disable_condition){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        disable_condition : item.attributes[attribute].disable_condition,
                        dropDownData : item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }
                else if(item.attributes[attribute].edit_type === 'imageEditor'){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        disable_condition : item.attributes[attribute].disable_condition,
                        defaultValue: item.attributes[attribute].defaultValue,
                        height: item.attributes[attribute].height,
                        width: item.attributes[attribute].width,
                        border: item.attributes[attribute].border,
                    })
                }
                else if (item.attributes[attribute].edit_type === 'AvlFormsJoin'){
                    data.push({
                        section_id: item.attributes[attribute].section,
                        label: item.attributes[attribute].label,
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleMultiSelectFilterChange.bind(this),
                        addAll: item.attributes[attribute].addAll,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        prompt: this.displayPrompt.bind(this),
                        type:item.attributes[attribute].edit_type,
                        display_condition:item.attributes[attribute].display_condition,
                        defaultValue: item.attributes[attribute].defaultValue,
                        parentConfig: item.attributes[attribute].parentConfig,
                        targetConfig: item.attributes[attribute].targetConfig,
                        targetKey: item.attributes[attribute].targetKey,
                    })
                }
                else if(
                    ['false', undefined].includes(item.attributes[attribute].hidden)
                ){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        data_error : item.attributes[attribute].data_error,
                        placeholder: item.attributes[attribute].placeholder,
                        required:item.attributes[attribute].field_required,
                        prompt: this.displayPrompt.bind(this),
                        type:item.attributes[attribute].edit_type,
                        defaultValue: item.attributes[attribute].defaultValue,
                        parentConfig: item.attributes[attribute].parentConfig
                    })
                }
            })
        });
        return data

    }


    static validateForm (state, config) {
        let cond2 = Object.keys(config.attributes)
            .filter(f => config.attributes[f].field_required === 'required')
            .reduce((a,c) => a && state[c], true)

        return cond2
    }

    renderHeaderText(header){
        return (
            this.props.geoData[header] ?
                get(this.props.geoData, `${header}.name`, '') :
                    Array.isArray(header) &&
                    header.filter(f => Object.keys(this.props.geoData).includes(f)).length ?
                        header.map(f => get(this.props.geoData, `${f}.name`, '')).join() :
                        header
        )
    }
    render(){
        let test = this.implementData();
        if (!test) return null
        let data = [];
        test.forEach((d,i) =>{
                data.push(d)

        });
        return(
            <div className="container">
                {get(this.props.config[0], `page_title`, null) &&
                this.state[this.props.config[0].page_title] ?
                    <h4 className="element-header" style={{textTransform: 'capitalize'}}>
                        <label>
                            {this.renderHeaderText(get(this.state,[this.props.config[0].page_title],''))}
                            {config[this.props.config[0].type] ?
                                <Link
                                    className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                    to={get(this.props.config, `[0].guidance`, `/guidance/${config[this.props.config[0].type][0].requirement}/view`)}
                                    target={'_blank'}
                                >?</Link>
                                : null}
                        </label>
                        {get(this.props.config[0], `sub_title`, null) ?
                            <h6>{this.renderHeaderText(get(this.state, `${this.props.config[0].sub_title}`, null))}</h6> : null}
                    </h4> :
                    <h4 className="element-header" style={{textTransform: 'capitalize'}}>
                        {get(this.props.config[0], `default_title`,
                            `${get(this.props.config, `[0].type`, '')} ${get(this.props.config, `[0].sub_type`, '')}`)}
                        {config[this.props.config[0].type] ?
                            <Link
                                className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                to={
                                    get(this.props.config, `[0].guidance`, `/guidance/${config[this.props.config[0].type][0].requirement}/view`)
                                } target={'_blank'}
                            >?</Link>
                            : null}
                    </h4>}
                <Element>
                    <div className="element-box">
                        <div className="form-group">
                            {data ?
                                data.map(d => {
                                return(<GraphFactory
                                    graph={{type: d.type }}
                                    {...d}
                                    autoLoad = {this.props.autoLoad}
                                />)
                            }) :
                                 null
                            }

                            <div className="form-buttons-w text-right">
                                {data ?
                                    data.map((d,i) =>{

                                        if(i === 0){
                                            if(d.formType[0] === 'roles'){
                                                return (<button key = {i} className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit} disabled={!AvlFormsNewData.validateForm(this.state, this.props.config[0])}> Submit</button>)
                                            }else{
                                                return (<button key = {i} className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit}> Submit</button>)
                                            }
                                        }

                                    })
                                    :
                                    null
                                }

                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        userEmail:state.user.email,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        id : ownProps.id,
        geoData : get(state.graph,['geo'],{}),
        meta_data : get(state.graph,['forms']),
        forms_roles_data: get(state.graph,['forms','byId']),
        geoRelations: state.geo.geoRelations
    }

};

const mapDispatchToProps = {
    sendSystemMessage,
    AvlFormsNewData
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsNewData))