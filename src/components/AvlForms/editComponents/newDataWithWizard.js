import React from 'react';
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import GraphFactory from 'components/AvlForms/editComponents/graphFactory.js';
import Wizard from "./wizardComponent";
import {falcorGraph} from "../../../store/falcorGraph";
var _ = require("lodash");

const counties = [
    "36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119",
    "36049", "36069", "36023","36085","36029","36079","36057","36105","36073","36065","36009",
    "36123","36107","36055", "36095","36007", "36083","36099","36081","36037","36117","36063","36047",
    "36015","36121","36061","36021","36013","36033","36017", "36067","36035","36087","36051","36025",
    "36071","36093","36005"
];


class AvlFormsNewDataWizard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        //this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this);

    }

    fetchFalcorDeps(){
        let form_type = this.props.config.map(d => d.type);
        let sub_type = '';
        let form = '';
        Object.keys(this.props.config[0].attributes).forEach(item =>{
            sub_type = this.props.config[0].attributes[item].sub_type
        });
        if(sub_type.length > 0){
            form = form_type + '_' + sub_type
        }else{
            form = form_type
        }

        return this.props.falcor.get(['geo',counties,['name']])
            .then(() =>{
                this.props.falcor.get(['forms',[form],'meta'],
                    ['forms',['roles'],'byPlanId',this.props.activePlan,'attributes']) // to populate action_point_of_contact for actions project
                    .then(response =>{
                        return response
                    })
            })
    }

    handleChange(e){
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    handleMultiSelectFilterChange(e, id, domain=[]) {

        let tmpObj = {};
        if (e.includes('Select All') && domain.length > 0){
            tmpObj[id] = domain.filter(f => f !== 'Select All' && f !== 'Select None');
        }else if (e.includes('Select None')){
            tmpObj[id] = [];
        }else{
            tmpObj[id] = [...e];
        }
        console.log('multi select', e, tmpObj, this.state);
        this.setState(tmpObj);
    }



    componentDidMount(){
        if(this.props.id && this.props.id[0]){
            let attributes = this.props.config.map(d => Object.keys(d.attributes));
            return this.props.falcor.get(['forms','byId',this.props.id])
                .then(response =>{
                    let graph = response.json.forms.byId[this.props.id];
                    let tmp_state = {}
                    if(graph){
                        attributes[0].forEach(attribute =>{
                            if(attribute.includes('date')){
                                let d = graph.attributes[attribute] ? graph.attributes[attribute].toString().split('-') : ''
                                let date = d[0] +'-'+ d[1] +'-'+ d[2] // 10/30/2010
                                tmp_state[attribute] = date
                            }else{
                                tmp_state[attribute] = graph.attributes[attribute]
                            }
                        });
                        this.setState(
                            tmp_state
                        )
                    }
                })
        }
    }

    onSubmit(e){
        e.preventDefault();
        let args = [];
        let type = this.props.config.map(d => d.type);
        if(this.props.id[0]){
            let attributes = Object.keys(this.state)
            return this.props.falcor.set({
                paths: [
                    ['forms', 'byId',this.props.id[0],'attributes',attributes]
                ],
                jsonGraph: {
                    forms:{
                        byId:{
                            [this.props.id[0]] : {
                                attributes : this.state
                            }
                        }
                    }
                }
            })
                .then(response => {
                    this.props.sendSystemMessage(`${type[0]} was successfully edited.`, {type: "success"});
                })

        }else{
            let attributes = {};
            let sub_type = '';
            let plan_id = parseInt(this.props.activePlan);
            this.props.config.forEach(config =>{
                Object.keys(config.attributes).forEach(item =>{
                    if(config.attributes[item].sub_type.length > 0){
                        sub_type = config.attributes[item].sub_type
                    }
                })
            })
            Object.keys(this.state).forEach(item =>{
                if(sub_type.length > 0){
                    attributes['sub_type'] = sub_type;
                    attributes[item] = this.state[item] || ''
                }else{
                    attributes[item] = this.state[item] || ''
                }

            });
            args.push(type[0],plan_id,attributes);
            return this.props.falcor.call(['forms','insert'], args, [], [])
                .then(response => {
                    this.props.sendSystemMessage(`${type[0]} was successfully created.`, {type: "success"});
                })
        }
    }

    cousubDropDown(event){
        let county = event.target.value;
        if(county !== 'None'){
            return this.props.falcor.get(['geo',county,'cousubs'])
                .then(response =>{
                    let cousubs = response.json.geo[county].cousubs;
                    this.props.falcor.get(['geo',cousubs,['name']])
                        .then(response =>{
                            return response
                        })
                })
        }else{
            return null
        }
    }

    geoData(){
        let countyData = [];
        let cousubsData = [];
        if(this.props.geoData){
            let graph = this.props.geoData;
            Object.keys(graph).forEach(item =>{
                if(item.length === 5){
                    countyData.push({
                        value : item,
                        name: graph[item].name
                    })
                }
                if(item.length > 5){
                    cousubsData.push({
                        value : item,
                        name : graph[item].name
                    })
                }
            })
        }
        return [countyData,cousubsData]
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
                     style={{display: 'none', margin: '20vh 20vw'}}
                     onClick={(e) => {
                         if (e.target.id === `closeMe`+id){
                             e.target.closest(`#closeMe`+id).style.display = 'none'
                         }
                     }}
                     aria-hidden="true">
                    <div className="modal-dialog modal-centered modal-bg" style={{width: '100%', height: '100%', padding: '5vh 5vw'}}>
                        <div className="modal-content text-center" style={{width: '100%', height: '100%'}}>
                            <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                        onClick={(e) => {
                                            console.log('cancel button', e.target.closest(`#closeMe`+id).style.display = 'none')
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div className="modal-body" style={{textAlign: 'justify'}}>
                                {this.props.config.map(item =>{
                                    return (<div>{item.attributes[id].prompt}</div>)
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    createWizardData(){
        let data = [];
        let countyData = this.geoData()[0];
        let cousubsData = this.geoData()[1];
        let filter_data = [];
        if(this.props.meta_data){
            this.props.config.forEach(item => {
                Object.keys(item.attributes).forEach(attribute => {
                    if(item.attributes[attribute].area === 'true' && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta && item.attributes[attribute].depend_on === undefined){
                        data.push({
                            section_id : item.attributes[attribute].section,
                            label: item.attributes[attribute].label,
                            formType : this.props.config.map(d => d.type),
                            handleChange : this.handleChange,
                            state : this.state,
                            title : attribute,
                            type:item.attributes[attribute].edit_type,
                            meta : countyData,
                            area:item.attributes[attribute].area,
                            prompt: this.displayPrompt.bind(this),
                            onClick : this.cousubDropDown.bind(this)
                        })
                    }else if(item.attributes[attribute].area === 'true' && item.attributes[attribute].depend_on  && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta){
                        data.push({
                            section_id : item.attributes[attribute].section,
                            label: item.attributes[attribute].label,
                            formType : this.props.config.map(d => d.type),
                            handleChange : this.handleChange,
                            state : this.state,
                            title : attribute,
                            type:item.attributes[attribute].edit_type,
                            depend_on : item.attributes[attribute].depend_on,
                            area:item.attributes[attribute].area,
                            prompt: this.displayPrompt.bind(this),
                            meta : cousubsData,
                        })
                    }else if(!item.attributes[attribute].area && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta === 'true' && item.attributes[attribute].meta_filter){
                        let graph = this.props.meta_data;

                        if(graph && item.attributes[attribute]){
                            if(graph[item.attributes[attribute].meta_filter.filter_key]){
                                graph[item.attributes[attribute].meta_filter.filter_key].meta.value.forEach(d =>{
                                    filter_data.push(d)
                                })
                            }

                        }

                        if(item.attributes[attribute].depend_on === undefined){
                            data.push({
                                section_id : item.attributes[attribute].section,
                                label: item.attributes[attribute].label,
                                formType : this.props.config.map(d => d.type),
                                handleChange : this.handleChange,
                                state : this.state,
                                title : attribute,
                                type:item.attributes[attribute].edit_type,
                                disable_condition:item.attributes[attribute].disable_condition,
                                prompt: this.displayPrompt.bind(this),
                                meta : filter_data ? filter_data : [],
                            })
                        }else{
                            data.push({
                                section_id : item.attributes[attribute].section,
                                label: item.attributes[attribute].label,
                                formType : this.props.config.map(d => d.type),
                                handleChange : this.handleChange,
                                state : this.state,
                                title : attribute,
                                type:item.attributes[attribute].edit_type,
                                disable_condition:item.attributes[attribute].disable_condition,
                                depend_on:item.attributes[attribute].depend_on,
                                prompt: this.displayPrompt.bind(this),
                                meta : filter_data ? filter_data : [],
                            })
                        }

                    }
                    else if(item.attributes[attribute].edit_type === 'radio') {
                        data.push({
                            section_id: item.attributes[attribute].section,
                            label: item.attributes[attribute].label,
                            formType: this.props.config.map(d => d.type),
                            handleChange: this.handleChange,
                            state: this.state,
                            title: attribute,
                            type: item.attributes[attribute].edit_type,
                            prompt: this.displayPrompt.bind(this),
                            values: item.attributes[attribute].edit_type_values,
                            display_condition : item.attributes[attribute].display_condition
                        })
                    }else if(item.attributes[attribute].edit_type === 'multiselect'&& item.attributes[attribute].meta === 'true'){
                        let graph = this.props.meta_data;
                        let filter = [];
                        if(graph && graph[item.attributes[attribute].meta_filter.filter_key]){
                            graph[item.attributes[attribute].meta_filter.filter_key].byPlanId[this.props.activePlan].attributes.value.forEach(d =>{
                                filter.push(d.attributes[item.attributes[attribute].meta_filter.value])
                            })

                        }else{
                            falcorGraph.getCache('capabilities')

                        }
                        data.push({
                            section_id: item.attributes[attribute].section,
                            formType : this.props.config.map(d => d.type),
                            label: item.attributes[attribute].label,
                            handleMultiSelectFilterChange : this.handleMultiSelectFilterChange.bind(this),
                            state : this.state,
                            title : attribute,
                            type:item.attributes[attribute].edit_type,
                            prompt: this.displayPrompt.bind(this),
                            filterData : filter ? filter : []
                        })
                    }else if(item.attributes[attribute].edit_type === 'multiselect' && item.attributes[attribute].meta === 'false'){
                        data.push({
                            section_id: item.attributes[attribute].section,
                            formType : this.props.config.map(d => d.type),
                            label: item.attributes[attribute].label,
                            handleMultiSelectFilterChange : this.handleMultiSelectFilterChange.bind(this),
                            state : this.state,
                            title : attribute,
                            type:item.attributes[attribute].edit_type,
                            prompt: this.displayPrompt.bind(this),
                            filterData : item.attributes[attribute].meta_filter.value
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
                            type:item.attributes[attribute].edit_type,
                            prompt: this.displayPrompt.bind(this),
                            disable_condition : item.attributes[attribute].disable_condition,
                            dropDownData : item.attributes[attribute].edit_type_values
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
                            type:item.attributes[attribute].edit_type,
                            prompt: this.displayPrompt.bind(this),
                            dropDownData : item.attributes[attribute].edit_type_values
                        })
                    }
                    else{
                        data.push({
                            section_id: item.attributes[attribute].section,
                            label: item.attributes[attribute].label,
                            formType : this.props.config.map(d => d.type),
                            handleChange : this.handleChange,
                            state : this.state,
                            title : attribute,
                            prompt: this.displayPrompt.bind(this),
                            type:item.attributes[attribute].edit_type,
                            display_condition:item.attributes[attribute].display_condition
                        })
                    }
                })
            });

        }

        return data

        }

    createWizardSections(){
        let data = this.createWizardData();
        let sections = this.props.config.map(d => d.sections);
        let steps = [];
        let wizard_steps = []
        sections[0].forEach(section =>{
            steps.push({
                title : section,
                content : []
            })
        });
        steps.forEach(step =>{
            data.forEach(item =>{
                if(step.title.id === item.section_id){
                    step.content.push(
                        (<GraphFactory
                            graph={{type: item.type }}
                            {...item}
                            isVisible = {true}
                        />)
                    )
                }
            })
        });
        steps.forEach(step =>{
            if(step.title.visibility){
                if(step.title.visibility.hidden === 'false'){
                    wizard_steps.push({
                        title : (<span>
                    <span style={{fontSize: '0.7em'}}>{step.title.visibility.check.includes(this.state[step.title.visibility.attribute]) ? step.title.title : step.title.visibility.optional}</span>
                    <br/><span style={{fontSize: '0.9em'}}>{step.title.sub_title}</span></span>),
                        content : (
                            <div className="col-sm-12">
                                {step.content.map(d => d)}
                            </div>
                        )

                    })
                }
                else{
                    if(step.title.visibility.check.includes(this.state[step.title.visibility.attribute])){
                        let hiddenStep9 = {
                            title : (<span>
                                    <span style={{fontSize: '0.7em'}}>{step.title.title}</span>
                                    <br/><span style={{fontSize: '0.9em'}}>{step.title.sub_title}</span></span>),
                            content : (
                                <div className="col-sm-12">
                                    {step.content.map(d => d)}
                                </div>
                            )
                        };
                        wizard_steps.splice(8,0, hiddenStep9);
                    }
                }
            }else{
                wizard_steps.push({
                    title : (<span>
                    <span style={{fontSize: '0.7em'}}>{step.title.title}</span>
                    <br/><span style={{fontSize: '0.9em'}}>{step.title.sub_title}</span></span>),
                    content : (
                        <div className="col-sm-12">
                            {step.content.map(d => d)}
                        </div>
                    )

                })
            }

        });
        return wizard_steps
    }
    render(){

        let sections = this.createWizardSections();
        return(
            <div className="container">
                <Element>
                    <Wizard steps={sections} submit={this.onSubmit}/>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        id : ownProps.id,
        geoData : get(state.graph,['geo'],{}),
        meta_data : get(state.graph,['forms'])
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsNewDataWizard))

