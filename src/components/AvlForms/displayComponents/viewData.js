import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import GraphFactory from 'components/AvlForms/displayComponents/graphFactory.js'
var _ = require('lodash')

const counties = ["36","36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

let county = '' ;
let cousub = '';

class AvlFormsViewData extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id : ''
        }
    }

    fetchFalcorDeps(){
        let id = []
        if(this.props.id[0].includes("[")){
            id = this.props.id[0].substr(1)
        }else if(this.props.id[0].includes("]")){
            id = this.props.id[0].substring(0, this.props.id[0].length - 1);
        }else{
            id = this.props.id
        }
        return this.props.falcor.get(['forms','byId',id])
            .then(response =>{
                this.setState({
                    id : id
                })
                let graph = response.json.forms.byId[id].attributes;
                Object.keys(graph).filter(d => d !== '$__path').forEach(item => {
                    let value = graph[item];
                    if(value && value.toString().substring(0,2) === '36' && counties.includes(value)){
                        county = value
                    }
                    if(value && value.toString().substring(0,5) === county && value.length === 10){
                        cousub = value
                    }

                })
                if(county.length !== 0){
                    this.props.falcor.get(['geo',county,['name']])
                        .then(response =>{
                            return response
                        })
                }
                if(cousub.length !==0){
                    this.props.falcor.get(['geo',cousub,['name']])
                        .then(response =>{
                            return response
                        })
                }


                return response
            })
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
                Object.keys(graph[item].attributes).forEach((d,i) =>{
                    let section = get(config[0][d], `section`, null),
                        label = get(config[0][d], `label`, null),
                        displayType = get(config[0][d], `display_type`, null),
                        formType = get(config[0][d], `form_type`, null);
                    if(config_attributes[0].includes(d)){
                        if(graph[item].attributes[d] === county || graph[item].attributes[d]=== cousub){
                            data.push({
                                attribute : d,
                                value: geoData[graph[item].attributes[d]] ? geoData[graph[item].attributes[d]].name : 'None',
                                section,
                                label,
                                displayType,
                                formType
                            })
                        }
                        else{
                            if( !config[0][d].hidden || config[0][d].hidden !== 'true'){
                                data.push({
                                    attribute:d,
                                    value: graph[item].attributes[d] ? graph[item].attributes[d].toString() || 'None' : '',
                                    section,
                                    label,
                                    displayType,
                                    formType
                                })
                            }

                        }
                    }
                    else{
                        if(d !== 'sub_type' && d !== 'type' && d !=='plan_id'){
                            missing_attributes = config_attributes[0].filter(i => Object.keys(graph[item].attributes).indexOf(i) < 0);
                            missing_attributes.forEach(ma =>{
                                let renamed_column = config[0][ma].rename_column;
                                let section = get(config[0][ma], `section`, null),
                                    label = get(config[0][ma], `label`, null),
                                    displayType = get(config[0][d], `display_type`, null),
                                    formType = get(config[0][d], `form_type`, null);

                                if(renamed_column){
                                    Object.keys(renamed_column).forEach(rc =>{
                                        if(graph[item].attributes[rc]){
                                            if(graph[item].attributes[rc] === county || graph[item].attributes[rc] === cousub){
                                                data.push({
                                                    attribute : ma,
                                                    value: geoData[graph[item].attributes[rc]] ? geoData[graph[item].attributes[rc]].name : 'None',
                                                    section,
                                                    label,
                                                    displayType,
                                                    formType
                                                })
                                            }else{
                                                data.push({
                                                    attribute : ma,
                                                    value : graph[item].attributes[rc],
                                                    section,
                                                    label,
                                                    displayType,
                                                    formType
                                                })
                                            }
                                        }else{
                                            renamed_column[rc].forEach(rcc =>{
                                                if(graph[item].attributes[rcc]){
                                                    if(graph[item].attributes[rcc] === county || graph[item].attributes[rcc] === cousub){
                                                        data.push({
                                                            attribute : ma,
                                                            value: geoData[graph[item].attributes[rcc]] ? geoData[graph[item].attributes[rcc]].name : 'None',
                                                            section,
                                                            label,
                                                            displayType,
                                                            formType
                                                        })
                                                    }else{
                                                        data.push({
                                                            attribute : ma,
                                                            value : graph[item].attributes[rcc],
                                                            section,
                                                            label,
                                                            displayType,
                                                            formType
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

        return(
            <GraphFactory
                graph={{type: 'text'}}
                data={data}
                config={this.props.config}
                isVisible = {true}
                showHeader={this.props.showHeader}
            >
            </GraphFactory>
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
        id : ownProps.id
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsViewData))

