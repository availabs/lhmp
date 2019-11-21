import React from 'react';
import Wizard from 'components/light-admin/wizard'
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import GraphFactory from 'components/AvlForms/editComponents/graphFactory.js';
import config from "../../../pages/auth/Capabilities/capability/config";

var _ = require("lodash");

const counties = [
    "36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119",
    "36049", "36069", "36023","36085","36029","36079","36057","36105","36073","36065","36009",
    "36123","36107","36055", "36095","36007", "36083","36099","36081","36037","36117","36063","36047",
    "36015","36121","36061","36021","36013","36033","36017", "36067","36035","36087","36051","36025",
    "36071","36093","36005"
];


class AvlFormsNewData extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    fetchFalcorDeps(){
        let form_type = this.props.config.map(d => d.type)
        return this.props.falcor.get(['geo',counties,['name']])
            .then(() =>{
                this.props.falcor.get(['forms',form_type,'meta'])
                    .then(response =>{
                        return response
                    })
            })
    }

    handleChange(e){
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    componentDidMount(){
        if(this.props.id[0]){
            let attributes = this.props.config.map(d => Object.keys(d.attributes));
            return this.props.falcor.get(['forms','byId',this.props.id])
                .then(response =>{
                    let graph = response.json.forms.byId[this.props.id];
                    let tmp_state = {}
                    if(graph){
                        attributes[0].forEach(attribute =>{
                            tmp_state[attribute] = graph.attributes[attribute]
                        });
                        this.setState(
                            tmp_state
                        )
                    }
                    /*

                     */
                })
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
                <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-sm show" role="dialog"
                     id={`closeMe`+id}
                     tabIndex="1" style={{'display': 'none'}} aria-hidden="true">
                    <div className="modal-dialog modal-sm" style={{'float': 'right'}}>
                        <div className="modal-content">
                            <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                        onClick={(e) => {
                                            console.log('cancel button', e.target.closest(`#closeMe`+id).style.display = 'none')
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div className="modal-body">
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


    onSubmit(e){
        e.preventDefault();
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
                    this.props.sendSystemMessage(`Capability was successfully edited.`, {type: "success"});
                })

        }else{
            let args = []
            let plan_id = parseInt(this.props.activePlan);
            let type = this.props.config.map(d => d.type);
            let attributes = {}
            Object.keys(this.state).forEach(item =>{
                attributes[item] = this.state[item]
            });
            args.push(type[0],plan_id,attributes);
            return this.props.falcor.call(['forms','insert'], args, [], [])
                .then(response => {
                    this.props.sendSystemMessage(`Capability was successfully created.`, {type: "success"});
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
        this.props.config.forEach(item =>{
            Object.keys(item.attributes).forEach(attribute =>{
                if(attribute === 'county' && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        type:item.attributes[attribute].edit_type,
                        meta : countyData,
                        prompt: this.displayPrompt.bind(this),
                        onClick : this.cousubDropDown.bind(this)
                    })
                }else if(attribute === 'municipality' && this.state.county !== undefined && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        type:item.attributes[attribute].edit_type,
                        depend_on : item.attributes[attribute].depend_on,
                        prompt: this.displayPrompt.bind(this),
                        meta : cousubsData,
                    })
                }else if(attribute !== 'county' && attribute !== 'municipality' && item.attributes[attribute].edit_type === 'dropdown' && item.attributes[attribute].meta){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        type: item.attributes[attribute].edit_type,
                        meta: meta_data,
                        prompt: this.displayPrompt.bind(this),
                        depend_on : item.attributes[attribute].depend_on

                    })
                }else if(item.attributes[attribute].edit_type === 'radio'){
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        type:item.attributes[attribute].edit_type,
                        prompt: this.displayPrompt.bind(this),
                        values:item.attributes[attribute].edit_type_values
                    })
                }
                else{
                    data.push({
                        formType : this.props.config.map(d => d.type),
                        handleChange : this.handleChange,
                        state : this.state,
                        title : attribute,
                        prompt: this.displayPrompt.bind(this),
                        type:item.attributes[attribute].edit_type
                    })
                }

            })
        });
        return data

    }


    render(){

        let test = this.implementData();
        let data = [];
        test.forEach((d,i) =>{
                data.push(d)

        });
        return(
            <div className="container">
                <Element>
                    <h6 className="element-header">New Capability</h6>
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
                                <button className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit}> Submit</button>
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
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        id : ownProps.id,
        geoData : get(state.graph,['geo'],{}),
        meta_data : get(state.graph,['forms',])
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsNewData))