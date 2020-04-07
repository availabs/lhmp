import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import _ from 'lodash';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import TableSelector from "components/light-admin/tables/tableSelector"
import {RenderConfig} from 'pages/Public/theme/ElementFactory'
import config from 'pages/auth/Plan/config/guidance-config'
const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class AvlFormsListTable extends React.Component{
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
        let formAttributes = Object.keys(this.props.config[0].attributes).filter(attr => this.props.config[0].attributes[attr].list_attribute);
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
        let formAttributes = Object.keys(this.props.config[0].attributes).filter(attr => this.props.config[0].attributes[attr].list_attribute);
        let combine_list_attributes = this.props.config.map(d => d.combine_list_attributes);
        let listViewData = [];
        let formType = this.props.config.map(d => d.type);

        if(graph){
            if(combine_list_attributes[0] === undefined){
                Object.keys(graph).forEach(item =>{
                    let data = {};
                    formAttributes.forEach(attribute =>{
                        if(graph[item].value && graph[item].value.attributes){
                            if(this.state.form_ids.includes(item)){
                                data['id'] = item;
                                data[attribute] = graph[item].value.attributes[attribute] || ' ';
                                ['view', 'edit']
                                    .filter(f => this.props[f+'Button'] === true || this.props[f+'Button'] === undefined)
                                    .forEach(f => {
                                    data[f] = graph[item].value.attributes['sub_type'] ?
                                        (f === 'view' ?
                                            `/${formType[0]}/${f}/${graph[item].value.attributes['sub_type']}/${item}` :
                                            `/${formType[0]}/${graph[item].value.attributes['sub_type']}/${f}/${item}`) :
                                        `/${formType[0]}/${f}/${item}`;
                                })
                                if (this.props.deleteButton === true || this.props.deleteButton === undefined){
                                    data['delete'] =
                                        <button id= {item} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                }
                            }

                        }
                    });
                    listViewData.push(data)

                });
            }else{
                Object.keys(graph).forEach(item =>{
                    let initial_data = {}
                    let data = {};
                    combine_list_attributes[0].attributes.forEach((attribute,i) =>{
                        Object.keys(geo).filter(d => d !== 'S__path').forEach(g =>{
                            if(this.state.form_ids.includes(item)){
                                initial_data['id'] = item;
                                initial_data[attribute] = geo[graph[item].value.attributes[attribute]] ?
                                    geo[graph[item].value.attributes[attribute]].name || '' :
                                    graph[item].value.attributes[attribute];
                            }

                        })
                    });

                    formAttributes.filter(d=> !combine_list_attributes[0].attributes.includes(d)).forEach(attribute =>{
                        if(graph[item].value && graph[item].value.attributes){
                            if(this.state.form_ids.includes(item)){
                                data['id'] = item
                                data[attribute] = graph[item].value.attributes[attribute] || ' '
                                let value = Object.keys(initial_data).filter(d => d !== 'id').map(function(k)
                                {
                                    if(initial_data['id'] === item)
                                        return initial_data[k]
                                });
                                data[combine_list_attributes[0].result] = !value.includes("") ? value.join(",") : value;
                                ['view', 'edit']
                                .filter(f => this.props[f+'Button'] === true || this.props[f+'Button'] === undefined)
                                .forEach(f => {
                                    data[f] = graph[item].value.attributes['sub_type'] ?
                                        (f === 'view' ?
                                            `/${formType[0]}/${f}/${graph[item].value.attributes['sub_type']}/${item}` :
                                            `/${formType[0]}/${graph[item].value.attributes['sub_type']}/${f}/${item}`) :
                                        `/${formType[0]}/${f}/${item}`;
                                });
                                if (this.props.deleteButton === true || this.props.deleteButton === undefined){
                                    data['delete'] =
                                        <button id= {item} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                }
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
        let listAttributes = Object.keys(this.props.config[0].attributes).filter(attr => this.props.config[0].attributes[attr].list_attribute);
        let data = this.formsListTable();
        listViewData = data.filter(value => Object.keys(value).length !== 0)
        let formType = this.props.config.map(d => d.type);
        if(listViewData && listViewData.length > 0){
            if(!_.isEqual(Object.keys(...listViewData).sort(), listAttributes.sort())){
                formAttributes = Object.keys(...listViewData).filter(d => !['id', 'view', 'edit', 'delete'].includes(d))
            }else{
                formAttributes = listAttributes
            }
        }
        console.log('data', data, formAttributes)

        return (
                <div className='container'>
                    <Element>
                        <h4 className="element-header">{this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                            <span style={{float:'right'}}>
                        {this.props.config.map(d =>{
                            if(d.type === 'actions' ){
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return(
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/worksheet/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )
                                }else{
                                    return null
                                }
                            }else if(d.type === 'participation'){
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return (
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/time/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )
                                }else{
                                    return null
                                }
                            }else{
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return (
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                        </Link>
                                    )
                                }else{
                                    return null
                                }

                            }
                        })
                        }

                        {this.props.config.map(d => {
                            if(d.type === 'actions'){
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return (
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/project/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                        </Link>
                                    )
                                }else{
                                    return null
                                }

                            }else if(d.type === 'participation'){
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return(
                                        <Link
                                            className="btn btn-sm btn-primary"
                                            to={ `/${this.props.config.map(d=> d.type)}/meeting/new` } >
                                            Create New {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Meeting
                                        </Link>
                                    )
                                }else{
                                    return null
                                }

                            }
                            else{
                                if(this.props.createButtons === true || this.props.createButtons === undefined){
                                    return (
                                        <button
                                            disabled
                                            className="btn btn-sm btn-disabled"
                                        >
                                            Create {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))} Planner
                                        </button>
                                    )
                                }else{
                                    return null
                                }

                            }
                        })}
                                {this.props.createButtons === true || this.props.createButtons === undefined ?
                                    <button
                                        disabled
                                        className="btn btn-sm btn-disabled"
                                    >
                                        Create HMGP {this.props.config.map(d => d.type.charAt(0).toUpperCase() + d.type.substr(1))}
                                    </button>
                                    :null}

                    </span>
                        </h4>
                        {config[this.props.config[0].type] ?
                            <div className="element-box">
                                <RenderConfig
                                    config={{[this.props.config[0].type]:config[this.props.config[0].type]}}
                                    user={this.props.user}
                                    showTitle={false}
                                    showHeader={false}
                                    pureElement={true}
                                />
                            </div> : null}
                        {
                            listViewData.length > 0 ?
                                <div className="element-box">
                                    <div className="table-responsive" >
                                        <TableSelector
                                            data={listViewData}
                                            columns={formAttributes.map(f => ({
                                                Header: f,
                                                accessor: f,
                                                filter: 'default',
                                                sort: true
                                            }))}
                                            flex={this.props.flex ? this.props.flex : false}
                                            height={this.props.height ? this.props.height : ''}
                                            width={this.props.width ? this.props.width : ''}
                                            tableClass={this.props.tableClass ? this.props.tableClass : null}
                                            actions={{edit:true, view:true, delete:true}}
                                        />
                                    </div>
                                </div>
                            :
                                <div className="element-box">No data found...</div>
                        }
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
        formsListData : get(state.graph,['forms','byId'],{}),
        geoData : get(state.graph,['geo'],{}),
        formsByIdData: get(state.graph,['forms']),
        user: get(state, 'user', null)

    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsListTable))




