import React from 'react';
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import GraphFactory from 'components/AvlForms/editComponents/graphFactory.js';
import styled from "styled-components";
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
const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;

class AvlFormsNewData extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
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
                                            console.log('cancel button', e.target.closest(`#closeMe`+id).style.display = 'none')
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div className="modal-body" style={{textAlign: 'justify'}}>
                                {this.props.config.map(item =>{
                                    return (<div>{item.attributes[id].prompt}</div>)
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


    onSubmit(e){
        e.preventDefault();
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
                    if(config.attributes[item].sub_type.length > 0){
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
                    attributes[item] = this.state[item]
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
        let county = typeof event.target.value === "object" ? event.target.value : [event.target.value];
        if(county && county !== 'None'){
            return this.props.falcor.get(['geo',county,'cousubs'])
                .then(response =>{
                    console.log('cousub dropdown 1', response, county)
                    let cousubs = [];
                    county.map(c => cousubs.push(...get(response, `json.geo[${c}].cousubs`, []).filter(f => f)));
                    if (cousubs){
                        this.props.falcor.get(['geo',cousubs,['name']])
                            .then(response =>{
                                console.log('cousub dropdown 2', response, cousubs)
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
        console.log('geodata called',graph, this.state)
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
            console.log('check this', filterOn, Object.keys(graph).filter(item =>filterOn && filterOn.includes(item.toString())))
            Object.keys(graph)
                .filter(item => filterOn && filterOn.includes(item.toString()))
                .forEach(item =>{
                    console.log('cousubs loop', item,get(graph, `${item}.cousubs.value`, []))

                    get(graph, `${item}.cousubs.value`, [])
                        .filter(cousub => get(graph, `${cousub}.name`, null))
                        .forEach(cousub => {
                            console.log('pushing for cousub', cousub)
                        cousubsData.push({
                            value : cousub,
                            name : get(graph, `${cousub}.name`, '')
                        })
                    })
            })
        }
        console.log('geodata returning', cousubsData)
        return [countyData,cousubsData]
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
        this.setState(tmpObj);
    }

    implementData(){
        let data = [];
        let countyData = this.geoData()[0];
        let cousubsData = this.geoData()[1];
        let meta_data = [];
        let form_type = this.props.config.map(d => d.type)[0];
        if(this.props.meta_data) {
            let graph = this.props.meta_data;
            if(graph[form_type]){
                meta_data = graph[form_type].meta ? graph[form_type].meta.value : []
            }
        }
        if (!countyData.length) return null;
        console.log('county and cousubs', cousubsData)
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
                        depend_on : item.attributes[attribute].depend_on,
                        area:item.attributes[attribute].area,
                        prompt: this.displayPrompt.bind(this),
                        meta : cousubsData || [],
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
                        required: item.attributes[attribute].field_required,
                        meta: meta_data ? meta_data : [],
                        prompt: this.displayPrompt.bind(this),
                        depend_on : item.attributes[attribute].depend_on,
                        defaultValue: item.attributes[attribute].defaultValue

                    })
                }else if(item.attributes[attribute].edit_type === 'radio'
                    && ['false', undefined].includes(item.attributes[attribute].hidden)
                ){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        label: item.attributes[attribute].label,
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        placeholder: item.attributes[attribute].placeholder,
                        required: item.attributes[attribute].field_required,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        values:item.attributes[attribute].edit_type_values,
                        defaultValue: item.attributes[attribute].defaultValue
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
                        defaultValue: item.attributes[attribute].defaultValue
                    })
                }

            })
        });
        return data

    }


    static validateForm () {
        let cond2 = (document.getElementById('contact_county') &&
            document.getElementById('contact_title_role'))
            && (document.getElementById('contact_county').value.length > 0 &&
                document.getElementById('contact_title_role').value.length > 0);

        let cond3 = (document.getElementById('contact_name')) && (document.getElementById('contact_name').value.length > 0)

        return cond2 && cond3
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
                <Element>
                    <div className="element-box">
                        <div className="form-group">
                            {data ?
                                data.map(d => {
                                return(<GraphFactory
                                    graph={{type: d.type }}
                                    {...d}
                                    isVisible = {true}
                                />)
                            }) :
                                 null
                            }

                            <div className="form-buttons-w text-right">
                                {data ?
                                    data.map((d,i) =>{

                                        if(i === 0){
                                            if(d.formType[0] === 'roles'){
                                                return (<button className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit} disabled={!AvlFormsNewData.validateForm()}> Submit</button>)
                                            }else{
                                                return (<button className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit}> Submit</button>)
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
        forms_roles_data: get(state.graph,['forms','byId'])

    }

};

const mapDispatchToProps = {
    sendSystemMessage,
    AvlFormsNewData
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsNewData))