import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"
import {push} from "react-router-redux";
import {filter} from "fuzzy";

import styled from 'styled-components';

var _ = require('lodash')

const ScrollBody = styled.tbody`
   ${props => props.theme.panelDropdownScrollBar}
`

const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsListTableHMP extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            form_ids : [],
            data : []

        }
        this.formsListTable = this.formsListTable.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    fetchFalcorDeps(){
        let formType = this.props.config.map(d => d.type)
        let formAttributes = this.props.config.map(d => d.list_attributes);
        let ids = [];
        return this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if(length > 0){
                    this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes])
                        .then(response =>{
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id =>{
                                if(graph[id]){
                                    ids.push(graph[id].id)
                                }

                            })
                            this.setState({
                                form_ids : ids
                            })
                            return response
                        })
                }

            })
    }


    componentDidMount(){
        return this.props.falcor.get(['geo',counties,'cousubs'],
            ['geo',counties,['name']])
            .then(response =>{
                let graph = response.json.geo;
                let cousubs = []
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    cousubs.push(graph[item].cousubs)
                })
                this.props.falcor.get(['geo',cousubs.flat(1),['name']])
                    .then(response =>{
                        return response
                    })
            })
    }

    deleteItem (e){
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this form with id "${ id }"?`,
            {
                onConfirm: () => this.props.falcor.call(['forms','remove'],[id])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ id }`,
                type: "danger",
                duration: 0
            }
        )
    }

    formsListTable(){
        let geo = this.props.geoData
        let graph = this.props.formsListData;
        //let formAttributes = this.props.config.map(d => d.list_attributes);
        let combine_list_attributes = this.props.config.map(d => d.combine_list_attributes);
        let filter_list_attributes = this.props.config.map(d => d.filter_list_attributes);
        let listViewData = [];
        let list_attributes = this.props.list_attributes
        if(graph){
            if(combine_list_attributes[0] === undefined){
                if(filter_list_attributes[0]){
                    Object.keys(graph).forEach(item =>{
                        let data = {};
                        if(graph[item].value && graph[item].value.attributes){
                            if(graph[item].value.attributes[filter_list_attributes[0].filter] === filter_list_attributes[0].value){
                                for (var i = 0; i<list_attributes.length; i++){
                                    if(graph[item].value && graph[item].value.attributes){
                                        if(this.props.list_attributes[i].includes('date')){
                                            if(this.state.form_ids.includes(item)){
                                                data['id'] = item
                                                data[this.props.list_attributes[i]] = graph[item].value.attributes[this.props.list_attributes[i]] ? graph[item].value.attributes[this.props.list_attributes[i]].toString().split('-')[0] :''
                                            }
                                        }else{
                                            if(this.state.form_ids.includes(item)){
                                                data['id'] = item
                                                data[this.props.list_attributes[i]] = geo[graph[item].value.attributes[this.props.list_attributes[i]]] ? geo[graph[item].value.attributes[this.props.list_attributes[i]]].name || '' : graph[item].value.attributes[this.props.list_attributes[i]]
                                            }
                                        }
                                    }
                                }
                                listViewData.push(data)
                            }
                        }
                    })
                }else{
                    Object.keys(graph).forEach(item =>{
                        let data = {};
                        for (var i = 0; i<list_attributes.length; i++){
                            if(graph[item].value && graph[item].value.attributes){
                                if(this.props.list_attributes[i].includes('date')){
                                    if(this.state.form_ids.includes(item)){
                                        data['id'] = item
                                        data[this.props.list_attributes[i]] = graph[item].value.attributes[this.props.list_attributes[i]] ? graph[item].value.attributes[this.props.list_attributes[i]].toString().split('-')[0] :''
                                    }
                                }else{
                                    if(this.state.form_ids.includes(item)){
                                        data['id'] = item
                                        data[this.props.list_attributes[i]] = geo[graph[item].value.attributes[this.props.list_attributes[i]]] ? geo[graph[item].value.attributes[this.props.list_attributes[i]]].name || '' : graph[item].value.attributes[this.props.list_attributes[i]]
                                    }
                                }
                            }
                        }
                        listViewData.push(data)

                    });
                }

            }else{
                Object.keys(graph).forEach(item =>{
                    let initial_data = {}
                    let data = {};
                    combine_list_attributes[0].attributes.forEach((attribute,i) =>{
                        Object.keys(geo).filter(d => d !== 'S__path').forEach(g =>{
                            if(attribute.includes('date')){
                                if(this.state.form_ids.includes(item)){
                                    data['id'] = item
                                    data[attribute] = graph[item].value.attributes[attribute] ? graph[item].value.attributes[attribute].split('-')[0] :''
                                }
                            }else {
                                if (this.state.form_ids.includes(item)) {
                                    initial_data['id'] = item;
                                    initial_data[attribute] = geo[graph[item].value.attributes[attribute]] ? geo[graph[item].value.attributes[attribute]].name || '' : graph[item].value.attributes[attribute]
                                }
                            }

                        })
                    });

                    list_attributes.filter(d=> !combine_list_attributes[0].attributes.includes(d)).forEach(attribute =>{
                        if(graph[item].value && graph[item].value.attributes){
                            if(this.state.form_ids.includes(item)){
                                data['id'] = item
                                data[attribute] = graph[item].value.attributes[attribute] || ' '
                                let value = Object.keys(initial_data).filter(d => d !== 'id').map(function(k)
                                {
                                    if(initial_data['id'] === item)
                                        return initial_data[k]
                                })
                                data[combine_list_attributes[0].result] = !value.includes("") ? value.join(",") : value
                            }
                        }
                    })
                    listViewData.push(data)

                })
            }
            return listViewData
        }

    }

    render(){
        let formAttributes = [];
        let listViewData = [];
        let data = this.formsListTable();
        listViewData = data.filter(value => Object.keys(value).length !== 0)
        let formType = this.props.config.map(d => d.type);
        if(listViewData && listViewData.length > 0){
            if(!_.isEqual(Object.keys(...listViewData).sort(),this.props.config[0].list_attributes.sort())){
                formAttributes = Object.keys(...listViewData).filter(d => d !== 'id')
            }else{
                formAttributes = this.props.config[0].list_attributes
            }
        }
        let sub_type = ''
        Object.keys(this.props.config[0].attributes).forEach(d =>{
            if(this.props.config[0].attributes[d].sub_type !== 'project'){
                sub_type = this.props.config[0].attributes[d].sub_type
            }
        })
        return (
            
                <div className="table-responsive" style={{'overflow': 'scroll', 'maxHeight': '80vh'}}>
                    <table className="table table lightBorder">
                        <thead>
                        <tr>
                            {
                                formAttributes ? formAttributes.map((item) => {
                                        return (
                                            <th>{item}</th>
                                        )
                                    })
                                    :
                                    null
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            listViewData.map(item =>{
                                if(Object.keys(item).length > 0){
                                    return (
                                        <tr>
                                            {formAttributes ? formAttributes.map(attribute =>{
                                                return (
                                                    <td>{item[attribute]}</td>
                                                )
                                            }):null}
                                        </tr>
                                    )
                                }

                            })
                        }
                        </tbody>

                    </table>
                </div>
            
                           
                    
          

        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        config: ownProps.json,
        list_attributes: ownProps.list_attributes,
        formsListData : get(state.graph,['forms','byId'],{}),
        geoData : get(state.graph,['geo'],{}),
        formsByIdData: get(state.graph,['forms'])

    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTableHMP))




